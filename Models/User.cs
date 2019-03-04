namespace CoreReactRedux.Models
{
    public class User
    {
        public string id { get; set; }

        public string firstName { get; set; }
        public string lastName { get; set; }
        public string username { get; set; }
        public byte[] passwordHash { get; set; }
        public byte[] passwordSalt { get; set; }
    }
}