// Fill out your copyright notice in the Description page of Project Settings.
#include "Logic/HistoryBookGameInstance.h"
#include "HistoryBook.h"
#include "Config/ConfigManager.h"


void UHistoryBookGameInstance::Init()
{
	Super::Init();

	if (!FConfigManager::GetInstance().LoadGameConfig(FPaths::Combine(FPaths::ProjectContentDir(), ConfigBaseRelativeDirectory), GameConfigFileName))
	{
		UE_LOG(LogHistoryBook, Error, TEXT("UHistoryBookGameInstance::Init LoadGameConfig Fail!!! ConfigName:%s"), *GameConfigFileName);
	}
}

void UHistoryBookGameInstance::Shutdown()
{
	FConfigManager::GetInstance().ClearGameConfig();
	Super::Shutdown();
}

FString UHistoryBookGameInstance::GetGameName() const
{
	return FConfigManager::GetInstance().GetGameName();
}

FString UHistoryBookGameInstance::GetStageName(int64 InStageId) const
{
	if (const FStageConfigSharedPtrType TheStageConfig = FConfigManager::GetInstance().GetStageConfig(InStageId))
	{
		return TheStageConfig->Name;
	}
	return FString::Printf(TEXT("Unknown %lld"), InStageId);
}

bool UHistoryBookGameInstance::OnChooseStage(int32 InStageId)
{
	return RuntimeDataManager.Init(InStageId);
}
