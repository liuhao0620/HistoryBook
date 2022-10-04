// Fill out your copyright notice in the Description page of Project Settings.


#include "Gameplay/HBGameInstance.h"

#include "Data/HBConfigManager.h"

void UHBGameInstance::Init()
{
	Super::Init();
	ConfigManager = NewObject<UHBConfigManager>(this, ConfigManagerClass);
	if (ConfigManager != nullptr)
	{
		ConfigManager->Initialize();
	}
}
