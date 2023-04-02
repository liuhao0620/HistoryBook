// Fill out your copyright notice in the Description page of Project Settings.
#include "Config/ConfigManager.h"

FConfigManager& FConfigManager::GetInstance()
{
	static FConfigManager Instance;
	return Instance;
}

FConfigManager::FConfigManager()
{
}

FConfigManager::~FConfigManager()
{
}

bool FConfigManager::LoadGameConfig(const FString& InBaseDirectory, const FString& InConfigFileName)
{
	ConfigBaseDirectory = InBaseDirectory;
	TArray<FString> ConfigStrings;
	if (!FFileHelper::LoadFileToStringArray(ConfigStrings, *FPaths::Combine(ConfigBaseDirectory, InConfigFileName)))
	{
		return false;
	}
	// 第一行存储游戏名称
	GameName = ConfigStrings[0];
	// 第二行为阶段列表的标题
	// 第三行之后为阶段配置
	for (int32 i = 2; i < ConfigStrings.Num(); ++ i)
	{
		FStageConfigSharedPtrType OneStageConfig = FStageConfigType::ParseFromString(ConfigStrings[i]);
		if (!OneStageConfig.IsValid())
		{
			return false;
		}
		StageConfigs.Emplace(OneStageConfig->Id, OneStageConfig);
	}
	return true;
}

void FConfigManager::ClearGameConfig()
{
	ConfigBaseDirectory.Empty();
	GameName.Empty();
	StageConfigs.Reset();
}

bool FConfigManager::LoadStageConfig(int64 InStageId)
{
	FStageConfigSharedPtrType TheStageConfig = StageConfigs.FindRef(InStageId);
	if (!TheStageConfig.IsValid())
	{
		return false;
	}
	TArray<FString> CityConfigStrings, HeroConfigStrings, ItemConfigStrings;
	if (!FFileHelper::LoadFileToStringArray(CityConfigStrings, *FPaths::Combine(ConfigBaseDirectory, TheStageConfig->CityConfigFileName))
		|| !FFileHelper::LoadFileToStringArray(HeroConfigStrings, *FPaths::Combine(ConfigBaseDirectory, TheStageConfig->HeroConfigFileName))
		|| !FFileHelper::LoadFileToStringArray(ItemConfigStrings, *FPaths::Combine(ConfigBaseDirectory, TheStageConfig->ItemConfigFileName)))
	{
		return false;
	}
	for (int32 i = 1; i < CityConfigStrings.Num(); ++ i)
	{
		FCityConfigSharedPtrType OneCityConfig = FCityConfigType::ParseFromString(CityConfigStrings[i]);
		if (!OneCityConfig.IsValid())
		{
			return false;
		}
		TheStageConfig->CityConfigs.Emplace(OneCityConfig->Id, OneCityConfig);
	}
	for (int32 i = 1; i < HeroConfigStrings.Num(); ++ i)
	{
		FHeroConfigSharedPtrType OneHeroConfig = FHeroConfigType::ParseFromString(HeroConfigStrings[i]);
		if (!OneHeroConfig.IsValid())
		{
			return false;
		}
		TheStageConfig->HeroConfigs.Emplace(OneHeroConfig->Id, OneHeroConfig);
	}
	for (int32 i = 1; i < ItemConfigStrings.Num(); ++ i)
	{
		FItemConfigSharedPtrType OneItemConfig = FItemConfigType::ParseFromString(ItemConfigStrings[i]);
		if (!OneItemConfig.IsValid())
		{
			return false;
		}
		TheStageConfig->ItemConfigs.Emplace(OneItemConfig->Id, OneItemConfig);
	}
	return true;
}

void FConfigManager::ClearStageConfig(int64 InStageId)
{
	FStageConfigSharedPtrType TheStageConfig = StageConfigs.FindRef(InStageId);
	if (TheStageConfig.IsValid())
	{
		TheStageConfig->CityConfigs.Reset();
		TheStageConfig->HeroConfigs.Reset();
		TheStageConfig->ItemConfigs.Reset();
	}
}
