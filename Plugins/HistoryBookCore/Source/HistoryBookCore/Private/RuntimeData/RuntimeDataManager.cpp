// Fill out your copyright notice in the Description page of Project Settings.
#include "RuntimeData/RuntimeDataManager.h"
#include "Config/ConfigManager.h"

FRuntimeDataManager::FRuntimeDataManager()
{
}

FRuntimeDataManager::~FRuntimeDataManager()
{
}

bool FRuntimeDataManager::Init(int64 InStageId)
{
	const FStageConfigSharedPtrType TheStageConfig = FConfigManager::GetInstance().GetStageConfig(InStageId);
	if (!TheStageConfig.IsValid())
	{
		return false;
	}
	for (const auto& It : TheStageConfig->HeroConfigs)
	{
		
	}
	return true;
}

void FRuntimeDataManager::Clear()
{
	StageId = 0;
	AllCampData.Reset();
}
