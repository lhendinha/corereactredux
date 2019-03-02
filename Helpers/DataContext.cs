using Microsoft.EntityFrameworkCore;
using CoreReactRedux.Models;

namespace CoreReactRedux.Helpers
{
  public class DataContext : DbContext
  {
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
  }
}