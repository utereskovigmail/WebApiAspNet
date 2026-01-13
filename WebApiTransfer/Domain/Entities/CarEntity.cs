namespace Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;

[Table("tblCarts")]
public class CartEntity: BaseEntity<int>
{
    [ForeignKey(nameof(User))]
    public int UserId { get; set; }

    [ForeignKey(nameof(Transportation))]
    public int TransportationId { get; set; }

    public short CountTickets{ get; set; }
    public virtual UserEntity? User { get; set; }
    public virtual TransportationEntity? Transportation { get; set; }
}