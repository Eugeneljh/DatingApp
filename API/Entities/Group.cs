using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Group
    {
        public Group()
        {
        }

        public Group(string name)
        {
            Name = name;
        }

        [Key]
        public string Name { get; set; }

        // When creating a new group, we want a new list inside to add the connection
        public ICollection<Connection> Connections { get; set; } = new List<Connection>();
    }
}