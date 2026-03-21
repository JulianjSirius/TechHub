using TechHub.BLL.Interfaces;
using TechHub.BLL.Servicios;
using TechHub.DAL;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();



builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200") 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddOpenApi();

builder.Services.AddDbContext<TechHubDbContext>();
builder.Services.AddScoped<IAgendaService, AgendaService>();
builder.Services.AddScoped<IVentasService, VentasService>();
builder.Services.AddScoped<IUsuariosService, UsuariosService>();


var app = builder.Build();



if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

   
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "TechHub API");
    });
}

app.UseCors("PermitirAngular");

app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();