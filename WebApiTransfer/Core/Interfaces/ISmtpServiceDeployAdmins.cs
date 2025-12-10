namespace Core.Interfaces;

public interface ISmtpServiceDeployAdmins
{
    public bool SendEmail(List<UserEntity> admins);
}