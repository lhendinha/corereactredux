using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreReactRedux.Helpers;
using CoreReactRedux.Models;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;

namespace CoreReactRedux.Services
{
  public interface IUserService
  {
    Task<User> Authenticate(string username, string password);
    Task<IEnumerable<Object>> GetAll();
    Task<User> GetById(string id);
    Task<User> Create(User user, string password);
    Task Update(User user, string password = null);
    Task Delete(string id);
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
          cm.MapIdMember(c => c.id).SetIdGenerator(StringObjectIdGenerator.Instance);
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

    public async Task<User> Authenticate(string username, string password)
    {
      if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
        return null;

      var user = await _users.Find<User>(x => x.username == username).SingleOrDefaultAsync();

      // check if username exists
      if (user == null)
        return null;

      // check if password is correct
      if (!VerifyPasswordHash(password, user.passwordHash, user.passwordSalt))
        return null;

      // authentication successful
      return user;
    }

    public async Task<IEnumerable<Object>> GetAll()
    {
      var users = await _users.Find(_ => true)
          .Project(x => new
          {
            x.id,
            x.email,
            x.firstName,
            x.lastName,
            x.username
          }).ToListAsync();

      return users;
    }

    public async Task<User> GetById(string id)
    {
      var user = await _users.Find<User>(x => x.id == id).SingleOrDefaultAsync();

      if (user == null)
        throw new AppException("User not found");

      return user;
    }

    public async Task<User> Create(User user, string password)
    {
      // validation
      if (string.IsNullOrWhiteSpace(password))
        throw new AppException("Password is required");

      if (await _users.Find<User>(x => x.username == user.username).AnyAsync())
        throw new AppException("This username is already taken");

      byte[] passwordHash, passwordSalt;
      CreatePasswordHash(password, out passwordHash, out passwordSalt);

      user.passwordHash = passwordHash;
      user.passwordSalt = passwordSalt;

      await _users.InsertOneAsync(user);

      return user;
    }

    public async Task Update(User userParam, string password = null)
    {
      var user = await _users.Find<User>(x => x.id == userParam.id).SingleOrDefaultAsync();

      if (user == null)
        throw new AppException("User not found");

      if (userParam.username != user.username)
      {
        // username has changed so check if the new username is already taken
        if (await _users.CountDocumentsAsync<User>(x => x.username == userParam.username) != 0)
        {
          throw new AppException("Username " + userParam.username + " is already taken");
        }
      }
      if (userParam.email != user.email)
      {
        // email has changed so check if the new email is already taken
        if (await _users.CountDocumentsAsync<User>(x => x.email == userParam.email) != 0)
        {
          throw new AppException("Email " + userParam.username + " is already taken");
        }
      }

      // update user properties
      user.email = (userParam.email != null) ? userParam.email : user.email;
      user.firstName = (userParam.firstName != null) ? userParam.firstName : user.firstName;
      user.lastName = (userParam.lastName != null) ? userParam.lastName : user.lastName;
      user.username = (userParam.username != null) ? userParam.username : user.username;

      // update password if it was entered
      if (!string.IsNullOrWhiteSpace(password))
      {
        byte[] passwordHash, passwordSalt;
        CreatePasswordHash(password, out passwordHash, out passwordSalt);

        user.passwordHash = passwordHash;
        user.passwordSalt = passwordSalt;
      }

      await _users.ReplaceOneAsync(x => x.id == userParam.id, user);
    }

    public async Task Delete(string id)
    {
      var user = await _users.Find<User>(x => x.id == id).SingleOrDefaultAsync();
      if (user != null)
      {
        await _users.DeleteOneAsync(x => x.id == id);
      }
      else
      {
        throw new AppException("User not found");
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