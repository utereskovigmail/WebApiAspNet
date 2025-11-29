using System.Data;
using Core.Models.Location.City;
using Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Core.Validators.City;

public class CityCreateValidator : AbstractValidator<CityCreateModel>
{
    public CityCreateValidator(AppDbTransferContext db)
    {
        RuleFor(x => x.Name).NotEmpty()
            .MinimumLength(3).WithMessage("Name must be at least 3 characters long")
            .MaximumLength(150).WithMessage("Name must be between 3 and 100 characters")
            .DependentRules(() =>
            {
                RuleFor(x => x.Name)
                    .MustAsync(async (name, cancellation) =>
                        !await db.Cities.AnyAsync(c => c.Name.ToLower() == name.ToLower().Trim(), cancellation))
                    .WithMessage("City with this name already exists");
            });
        
        RuleFor(x => x.Slug).NotEmpty()
            .MinimumLength(3).WithMessage("Slug must be at least 3 characters long")
            .MaximumLength(150).WithMessage("Slug must be between 3 and 100 characters");
        
        RuleFor(x => x.Description).NotEmpty()
            .MinimumLength(3).WithMessage("Slug must be at least 3 characters long")
            .MaximumLength(500).WithMessage("Slug must be between 3 and 100 characters");

        RuleFor(x => x.CountryId).NotEmpty()
            .DependentRules(() =>
            {
                RuleFor(x => x.CountryId)
                    .MustAsync(async (id, cancellation) =>
                        !await db.Cities.AnyAsync(x => x.Id == id, cancellation))
                    .WithMessage("Country id must be provided correctly");

            });
        
        RuleFor(x => x.Image).NotEmpty().WithMessage("Image must be provided");
    }
}