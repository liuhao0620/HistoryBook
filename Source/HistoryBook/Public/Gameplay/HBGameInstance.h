// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "HBGameInstance.generated.h"

class UHBConfigManager;
class UDataTable;
/**
 * 
 */
UCLASS()
class HISTORYBOOK_API UHBGameInstance : public UGameInstance
{
	GENERATED_BODY()

public:
	virtual void Init() override;

	const UHBConfigManager* GetConfigManager() const { return ConfigManager; }
	
private:
	UHBConfigManager*				ConfigManager = nullptr;
	
	UPROPERTY(EditAnywhere)
	TSubclassOf<UHBConfigManager>	ConfigManagerClass;
};
