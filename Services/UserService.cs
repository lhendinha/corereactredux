using System;
using System.Collections.Generic;
using System.Linq;
using CoreReactRedux.Helpers;
using CoreReactRedux.Models;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;

namespace CoreReactRedux.Services
{
    public interface IUserService
    {
        User Authenticate(string username, string password);
        IEnumerable<User> GetAll();
        User GetById(string id);
        User Create(User user, string password);
        void Update(User user, string password = null);
        void Delete(string id);
    }

    public class UserService : IUserService
    {
        private readonly IMongoCollection<User> _users;

        private void DefineMapClass()
        {
            if (!BsonClassMap.IsClassMapRegistered(typeof(User)))
            {
                BsonClassMap.RegisterClassMap<User>(cm =>
                {
                    cm.AutoMap();
                    cm.MapIdMember(c => c.Id);
                    cm.IdMemberMap.SetSerializer(new StringSerializer(BsonType.ObjectId));
                });
            }
        }

        public UserService(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("DefaultConnection"));

            DefineMapClass();

            var database = client.GetDatabase("CoreReactRedux");
            _users = database.GetCollection<User>("Users");
        }

        public User Authenticate(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                return null;

            //var user = _context.Users.SingleOrDefault(x => x.Username == username);
            var user = _users.Find<User>(x => x.Username == username).FirstOrDefault();

            // check if username exists
            if (user == null)
                return null;

            // check if password is correct
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            // authentication successful
            return user;
        }

        public IEnumerable<User> GetAll()
        {
            //return _context.Users;
            return _users.Find(_ => true).ToList();
        }

        public User GetById(string id)
        {
            //return _context.Users.Find(id);
            return _users.Find<User>(x => x.Id == id).FirstOrDefault();
        }

        public User Create(User user, string password)
        {
            // validation
            if (string.IsNullOrWhiteSpace(password))
                throw new AppException("Password is required");

            //if (_context.Users.Any(x => x.Username == user.Username))
            //if (_users.Count(x => x.Username == user.Username) > 0)
            if (_users.Find<User>(x => x.Username == user.Username).Any())
                throw new AppException("This username is already taken");

            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            //_context.Users.Add(user);
            //_context.SaveChanges();
            _users.InsertOne(user);

            return user;
        }

        public void Update(User userParam, string password = null)
        {
            //var user = _context.Users.Find(userParam.Id);
            //var user = _users.Find<User>(x => x.Id == userParam.Id);
            var user = _users.Find<User>(x => x.Id == userParam.Id).FirstOrDefault();

            if (user == null)
                throw new AppException("User not found");

            if (userParam.Username != user.Username)
            {
                // username has changed so check if the new username is already taken
                //if (_context.Users.Any(x => x.Username == userParam.Username))
                throw new AppException("Username " + userParam.Username + " is already taken");
            }

            // update user properties
            user.FirstName = userParam.FirstName;
            user.LastName = userParam.LastName;
            user.Username = userParam.Username;

            // update password if it was entered
            if (!string.IsNullOrWhiteSpace(password))
            {
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(password, out passwordHash, out passwordSalt);

                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
            }

            _users.ReplaceOne(x => x.Id == userParam.Id, user);
        }

        public void Delete(string id)
        {
            //var user = _context.Users.Find(id);
            var user = _users.Find<User>(x => x.Id == id).FirstOrDefault();
            if (user != null)
            {
                //_context.Users.Remove(user);
                //_context.SaveChanges();
                _users.DeleteOne(x => x.Id == id);
            }
        }

        // private helper methods

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }

            return true;
        }
    }
}