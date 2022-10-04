// Fill out your copyright notice in the Description page of Project Settings.


#include "Data/HBConfigManager.h"

#include "Gameplay/HBGameInstance.h"

void UHBConfigManager::Initialize()
{
	if (IsValid(LandformConfigDataTable))
	{
		LandformConfigDataTable->ForeachRow<FHBLandformConfig>(TEXT("UHBConfigManager::Initialize"), [this](const FName& Key, const FHBLandformConfig& Value) mutable
		{
			LandformConfigs.Emplace(Value.Type, Value);
		});
	}
	if (IsValid(MilitaryConfigDataTable))
	{
		MilitaryConfigDataTable->ForeachRow<FHBMilitaryConfig>(TEXT("UHBConfigManager::Initialize"), [this](const FName& Key, const FHBMilitaryConfig& Value) mutable
		{
			MilitaryConfigs.Emplace(Value.Type, Value);
		});
	}
	if (IsValid(HeroConfigDataTable))
	{
		HeroConfigDataTable->ForeachRow<FHBHeroConfig>(TEXT("UHBConfigManager::Initialize"), [this](const FName& Key, const FHBHeroConfig& Value) mutable
		{
			HeroConfigs.Emplace(Value.Id, Value);
		});
	}
	if (IsValid(WarMapConfigDataTable))
	{
		WarMapConfigDataTable->ForeachRow<FHBWarMapConfig>(TEXT("UHBConfigManager::Initialize"), [this](const FName& Key, const FHBWarMapConfig& Value) mutable
		{
			WarMapConfigs.Emplace(Value.Id, Value);
		});
	}
}
