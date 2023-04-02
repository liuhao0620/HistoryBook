// Fill out your copyright notice in the Description page of Project Settings.
#pragma once
#include "ConfigTypes.h"

/**
 * 
 */
class HISTORYBOOKCORE_API FConfigManager
{
public:
	static FConfigManager& GetInstance();
private:
	FConfigManager();
	~FConfigManager();

public:
	bool LoadGameConfig(const FString& InBaseDirectory, const FString& InConfigFileName);
	void ClearGameConfig();
	bool LoadStageConfig(int64 InStageId);
	void ClearStageConfig(int64 InStageId);

	const FString& GetGameName() const { return GameName; }
	FStageConfigSharedPtrType GetStageConfig(int64 InStageId) const { return StageConfigs.FindRef(InStageId); }

private:
	FString									ConfigBaseDirectory;
	FString									GameName;
	TMap<int64, FStageConfigSharedPtrType>	StageConfigs;
};
