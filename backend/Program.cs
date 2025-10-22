using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS para desenvolvimento
builder.Services.AddCors(o => o.AddPolicy("Dev", p =>
    p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()
));

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("Dev");

app.MapControllers();

app.Run();
