// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "HBGameModeBase.h"
#include "HBWarGameMode.generated.h"

UCLASS()
class HISTORYBOOK_API AHBWarGameMode : public AHBGameModeBase
{
	GENERATED_BODY()

public:
	// Sets default values for this actor's properties
	AHBWarGameMode();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:
	// Called every frame
	virtual void Tick(float DeltaTime) override;

private:
	void InitWar();
};
