using System.Text.Json.Serialization;

namespace Core.Models.Cart;

public class CartAddUpdateModel
{
    [JsonPropertyName("transportationId")]
    public int TransportationId { get; set; }
    [JsonPropertyName("quantity")]
    public short Quantity { get; set; }
}