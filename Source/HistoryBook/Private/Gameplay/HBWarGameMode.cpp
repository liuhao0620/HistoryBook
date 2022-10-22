// Fill out your copyright notice in the Description page of Project Settings.


#include "Gameplay/HBWarGameMode.h"

#include "Character/HBWarHero.h"
#include "Data/HBConfigManager.h"
#include "Data/HBConstants.h"
#include "Gameplay/HBGameInstance.h"
#include "Gameplay/HBWarGameState.h"
#include "Kismet/GameplayStatics.h"


// Sets default values
AHBWarGameMode::AHBWarGameMode()
{
	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;
}

// Called when the game starts or when spawned
void AHBWarGameMode::BeginPlay()
{
	Super::BeginPlay();

	
	InitWar();
}

// Called every frame
void AHBWarGameMode::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
}

void AHBWarGameMode::InitWar()
{
	UWorld* World = GetWorld();
	const UHBGameInstance* HBGameInstance = Cast<UHBGameInstance>(UGameplayStatics::GetGameInstance(this));
	const AHBWarGameState* WarGameState = GetGameState<AHBWarGameState>();
	if (World == nullptr || HBGameInstance == nullptr || WarGameState == nullptr)
	{
		return;
	}
	const UHBConfigManager* ConfigManager = HBGameInstance->GetConfigManager();
	if (ConfigManager == nullptr)
	{
		return;
	}
	const FHBWarMapConfig* MapConfig = ConfigManager->GetWarMapConfig(WarGameState->GetMapConfigId());
	if (MapConfig == nullptr)
	{
		return;
	}
	// 初始化地图
	for (int32 x = 0; x < MapConfig->Width; ++ x)
	{
		for (int32 y = 0; y < MapConfig->Height; ++ y)
		{
			const EHBLandformType LandformType = MapConfig->GetLandformType(FIntVector2(x, y));
			if (const FHBLandformConfig* LandformConfig = ConfigManager->GetLandformConfig(LandformType))
			{
				if (LandformConfig->ActorClass != nullptr)
				{
					FVector ActorLoc = MapConfig->PositionToLocation(FIntVector2(x, y));
					World->SpawnActor(LandformConfig->ActorClass, &ActorLoc);
				}
			}
		}
	}
	// 初始化将领
	const TArray<int32>& RedHeroIds = WarGameState->GetRedHeroIds();
	const TArray<int32>& BlueHeroIds = WarGameState->GetBlueHeroIds();
	for (int32 i = 0; i < RedHeroIds.Num(); ++ i)
	{
		if (const FHBHeroConfig* HeroConfig = ConfigManager->GetHeroConfig(RedHeroIds[i]))
		{
			const EHBMilitaryType MilitaryType = HeroConfig->DefaultMilitaryType;
			if (const FHBMilitaryConfig* MilitaryConfig = ConfigManager->GetMilitaryConfig(MilitaryType))
			{
				if (MilitaryConfig->PawnClass != nullptr)
				{
					const FIntVector2 BirthPosition(MapConfig->RedBirthPointX, MapConfig->RedBirthPointY);
					FVector HeroLoc = MapConfig->PositionToLocation(BirthPosition);
					HeroLoc.Z += FHBCommonConstant::WarHeroHalfHeight;
					FTransform HeroTrans;
					HeroTrans.SetLocation(HeroLoc);
					if (AHBWarHero* RedHero = World->SpawnActorDeferred<AHBWarHero>(MilitaryConfig->PawnClass, HeroTrans))
					{
						RedHero->InitParameters(EHBWarCamp::ERed, RedHeroIds[i], BirthPosition);
						RedHero->FinishSpawning(HeroTrans);
					}
				}
			}
		}
	}
	for (int32 i = 0; i < BlueHeroIds.Num(); ++ i)
	{
		if (const FHBHeroConfig* HeroConfig = ConfigManager->GetHeroConfig(BlueHeroIds[i]))
		{
			const EHBMilitaryType MilitaryType = HeroConfig->DefaultMilitaryType;
			if (const FHBMilitaryConfig* MilitaryConfig = ConfigManager->GetMilitaryConfig(MilitaryType))
			{
				if (MilitaryConfig->PawnClass != nullptr)
				{
					const FIntVector2 BirthPosition(MapConfig->BlueBirthPointX, MapConfig->BlueBirthPointY);
					FVector HeroLoc = MapConfig->PositionToLocation(BirthPosition);
					HeroLoc.Z += FHBCommonConstant::WarHeroHalfHeight;
					FTransform HeroTrans;
					HeroTrans.SetLocation(HeroLoc);
					if (AHBWarHero* BlueHero = World->SpawnActorDeferred<AHBWarHero>(MilitaryConfig->PawnClass, HeroTrans))
					{
						BlueHero->InitParameters(EHBWarCamp::EBlue, BlueHeroIds[i], BirthPosition);
						BlueHero->FinishSpawning(HeroTrans);
					}
				}
			}
		}
	}
}

