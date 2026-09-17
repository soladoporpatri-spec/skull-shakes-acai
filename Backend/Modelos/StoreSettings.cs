using System.ComponentModel.DataAnnotations;

namespace SkullShakes.Api.Modelos;

public class StoreSettings
{
    [Key]
    public int Id { get; set; }
    public bool IsAberta { get; set; }
    
    public bool UseAutoSchedule { get; set; } = false;
    
    // JSON structure: { "0": {"open": "14:00", "close": "23:00"}, "1": {"open": "14:00", "close": "23:00"}, ... }
    // 0 = Sunday, 1 = Monday, etc.
    public string ScheduleJson { get; set; } = "{}";
}
