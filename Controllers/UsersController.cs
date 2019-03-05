using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using System.IdentityModel.Tokens.Jwt;
using CoreReactRedux.Helpers;
using Microsoft.Extensions.Options;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using CoreReactRedux.Services;
using CoreReactRedux.Dtos;
using CoreReactRedux.Models;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private IUserService _userService;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;

        public UsersController(
            IUserService userService,
            IMapper mapper,
            IOptions<AppSettings> appSettings)
        {
            _userService = userService;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody]UserDto userDto)
        {
            var user = await _userService.Authenticate(userDto.username, userDto.password);

            if (user == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            var tokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.id.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            var tokenString = tokenHandler.WriteToken(token);

            // return basic user info (without password) and token to store client side
            return Ok(new
            {
                user = new
                {
                    Id = user.id,
                    Username = user.username,
                    FirstName = user.firstName,
                    LastName = user.lastName,
                },
                token = tokenString
            });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]UserDto userDto)
        {
            // map dto to entity
            var user = _mapper.Map<User>(userDto);

            try
            {
                // save 
                await _userService.Create(user, userDto.password);
                return Ok(new
                {
                    user = new
                    {
                        email = userDto.email,
                        firstName = userDto.firstName,
                        lastName = userDto.lastName,
                        userName = userDto.username
                    }
                });
            }
            catch (AppException ex)
            {
                // return error message if there was an exception
                System.Diagnostics.Debug.WriteLine("Exception: " + ex.Message);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var users = await _userService.GetAll();
                //var userDtos = _mapper.Map<IList<UserDto>>(users);
                return Ok(users);
            }
            catch (AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var user = await _userService.GetById(id);

            var userDto = new
            {
                user.firstName,
                user.lastName,
                user.email,
                user.username
            };

            return Ok(userDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody]UserDto userDto)
        {
            // map dto to entity and set id
            var user = _mapper.Map<User>(userDto);
            user.id = id;

            try
            {
                // save 
                await _userService.Update(user, userDto.password);
                return Ok(new
                {
                    mensagem = "User was change with success !"
                });
            }
            catch (AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _userService.Delete(id);
            return Ok(new
            {
                mensagem = "User was removed with success !"
            });
        }
    }
}
