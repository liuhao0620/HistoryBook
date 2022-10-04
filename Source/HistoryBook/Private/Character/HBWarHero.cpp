// Fill out your copyright notice in the Description page of Project Settings.


#include "Character/HBWarHero.h"

#include "Data/HBConfigManager.h"
#include "Data/HBConstants.h"
#include "Gameplay/HBGameInstance.h"
#include "Gameplay/HBWarGameState.h"
#include "Kismet/GameplayStatics.h"

uint32 GetTypeHash(const FIntVector2& InIntVec2)
{
	return HashCombine(StaticCast<uint32>(InIntVec2.X), StaticCast<uint32>(InIntVec2.Y));
}

// Sets default values
AHBWarHero::AHBWarHero()
{
	// Set this character to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;
}

// Called when the game starts or when spawned
void AHBWarHero::BeginPlay()
{
	Super::BeginPlay();
}

// Called every frame
void AHBWarHero::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
}

// Called to bind functionality to input
void AHBWarHero::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);
}

void AHBWarHero::NotifyActorOnClicked(FKey ButtonPressed)
{
	Super::NotifyActorOnClicked(ButtonPressed);

	DisplayMovableCursors();
}

void AHBWarHero::InitParameters(int32 InConfigId, FIntVector2 InPosition, int32 InLevel, int32 InSoldierCount)
{
	ConfigId = InConfigId;
	Position = InPosition;
	Level = InLevel;
	SoldierCount = InSoldierCount;
	
	const UHBGameInstance* HBGameInstance = Cast<UHBGameInstance>(UGameplayStatics::GetGameInstance(this));
	if (HBGameInstance == nullptr)
	{
		return;
	}
	const UHBConfigManager* ConfigManager = HBGameInstance->GetConfigManager();
	if (ConfigManager == nullptr)
	{
		return;
	}
	const FHBHeroConfig* HeroConfig = ConfigManager->GetHeroConfig(ConfigId);
	if (HeroConfig == nullptr)
	{
		return;
	}
	Name = HeroConfig->Name;
	MilitaryType = HeroConfig->DefaultMilitaryType;
	MaxSoldierCount = (Level + HeroConfig->Force + HeroConfig->Intellect) * FHBCommonConstant::SoldierCountScale;
	if (SoldierCount < 0 || SoldierCount > MaxSoldierCount)
	{
		SoldierCount = MaxSoldierCount;
	}
}

FName AHBWarHero::GetHeroName() const
{
	return Name;
}

int32 AHBWarHero::GetHeroLevel() const
{
	return Level;
}

int32 AHBWarHero::GetSoldierCount() const
{
	return SoldierCount;
}

int32 AHBWarHero::GetMaxSoldierCount() const
{
	return MaxSoldierCount;
}

void AHBWarHero::DisplayMovableCursors() const
{
	UWorld* World = GetWorld();
	const UHBGameInstance* HBGameInstance = Cast<UHBGameInstance>(UGameplayStatics::GetGameInstance(this));
	const AHBWarGameState* HBWarGameState = Cast<AHBWarGameState>(UGameplayStatics::GetGameState(this));
	if (World == nullptr || HBGameInstance == nullptr || HBWarGameState == nullptr)
	{
		return;
	}
	const UHBConfigManager* ConfigManager = HBGameInstance->GetConfigManager();
	if (ConfigManager == nullptr || !ConfigManager->GetMovableCursorClass())
	{
		return;
	}
	const FHBMilitaryConfig* MilitaryConfig = ConfigManager->GetMilitaryConfig(MilitaryType);
	const FHBWarMapConfig* WarMapConfig = ConfigManager->GetWarMapConfig(HBWarGameState->GetMapConfigId());
	if (MilitaryConfig == nullptr || WarMapConfig == nullptr)
	{
		return;
	}
	TArray<TPair<FIntVector2, int32>> NeedDisplayPositions;
	TSet<FIntVector2> InsidePositions;
	NeedDisplayPositions.Emplace(MakeTuple(Position, MilitaryConfig->Mobility));
	InsidePositions.Add(Position);
	for (int32 i = 0; i < NeedDisplayPositions.Num(); ++ i)
	{
		const FIntVector2& CurrentPosition = NeedDisplayPositions[i].Key;
		const int32 MobilityRemain = NeedDisplayPositions[i].Value;
		if (MobilityRemain > 0)
		{
			// try to add Position
			{
				const FIntVector2 TestPosition(CurrentPosition.X - 1,CurrentPosition.Y);
				if (!InsidePositions.Contains(TestPosition))
				{
					const EHBLandformType LandformType = WarMapConfig->GetLandformType(TestPosition);
					if (LandformType != EHBLandformType::Invalid)
					{
						if (const FHBLandformConfig* LandformConfig = ConfigManager->GetLandformConfig(LandformType))
						{
							NeedDisplayPositions.Emplace(MakeTuple(TestPosition, MobilityRemain - LandformConfig->MobilityCost));
							InsidePositions.Add(TestPosition);
						}
					}
				}
			}
			{
				const FIntVector2 TestPosition(CurrentPosition.X + 1, CurrentPosition.Y);
				if (!InsidePositions.Contains(TestPosition))
				{
					const EHBLandformType LandformType = WarMapConfig->GetLandformType(TestPosition);
					if (LandformType != EHBLandformType::Invalid)
					{
						if (const FHBLandformConfig* LandformConfig = ConfigManager->GetLandformConfig(LandformType))
						{
							NeedDisplayPositions.Emplace(MakeTuple(TestPosition, MobilityRemain - LandformConfig->MobilityCost));
							InsidePositions.Add(TestPosition);
						}
					}
				}
			}
			{
				const FIntVector2 TestPosition(CurrentPosition.X, CurrentPosition.Y - 1);
				if (!InsidePositions.Contains(TestPosition))
				{
					const EHBLandformType LandformType = WarMapConfig->GetLandformType(TestPosition);
					if (LandformType != EHBLandformType::Invalid)
					{
						if (const FHBLandformConfig* LandformConfig = ConfigManager->GetLandformConfig(LandformType))
						{
							NeedDisplayPositions.Emplace(MakeTuple(TestPosition, MobilityRemain - LandformConfig->MobilityCost));
							InsidePositions.Add(TestPosition);
						}
					}
				}
			}
			{
				const FIntVector2 TestPosition(CurrentPosition.X, CurrentPosition.Y + 1);
				if (!InsidePositions.Contains(TestPosition))
				{
					const EHBLandformType LandformType = WarMapConfig->GetLandformType(TestPosition);
					if (LandformType != EHBLandformType::Invalid)
					{
						if (const FHBLandformConfig* LandformConfig = ConfigManager->GetLandformConfig(LandformType))
						{
							NeedDisplayPositions.Emplace(MakeTuple(TestPosition, MobilityRemain - LandformConfig->MobilityCost));
							InsidePositions.Add(TestPosition);
						}
					}
				}
			}
		}
	}

	for (const auto& It : NeedDisplayPositions)
	{
		const FVector CursorLoc = WarMapConfig->PositionToLocation(It.Key);
		World->SpawnActor(ConfigManager->GetMovableCursorClass(), &CursorLoc);
	}
}

