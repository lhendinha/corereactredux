FROM microsoft/dotnet:2.2.104-sdk AS builder
WORKDIR /source

RUN curl -sL https://deb.nodesource.com/setup_11.x |  bash -
RUN apt-get install -y nodejs

COPY *.csproj .
RUN dotnet restore

COPY ./ ./

RUN dotnet publish "./CoreReactRedux.csproj" --output "./dist" --configuration Release --no-restore

FROM microsoft/dotnet:2.2.2-aspnetcore-runtime
WORKDIR /app
COPY --from=builder /source/dist .
EXPOSE 80
ENTRYPOINT ["dotnet", "CoreReactRedux.dll"]