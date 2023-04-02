// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "RuntimeData/RuntimeDataManager.h"
#include "HistoryBookGameInstance.generated.h"

/**
 * 
 */
UCLASS()
class HISTORYBOOK_API UHistoryBookGameInstance : public UGameInstance
{
	GENERATED_BODY()

public:
	virtual void Init() override;
	virtual void Shutdown() override;

public:
	UFUNCTION(BlueprintPure)
	FString GetGameName() const;
	UFUNCTION(BlueprintPure)
	FString GetStageName(int64 InStageId) const;

	UFUNCTION(BlueprintCallable)
	bool OnChooseStage(int32 InStageId);

private:
	UPROPERTY(EditDefaultsOnly)
	FString			ConfigBaseRelativeDirectory = TEXT("Config");
	UPROPERTY(EditDefaultsOnly)
	FString			GameConfigFileName;
	
private:
	FRuntimeDataManager	RuntimeDataManager;
};
