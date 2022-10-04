// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/GameStateBase.h"
#include "HBWarGameState.generated.h"

UCLASS()
class HISTORYBOOK_API AHBWarGameState : public AGameStateBase
{
	GENERATED_BODY()

public:
	// Sets default values for this actor's properties
	AHBWarGameState();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:
	// Called every frame
	virtual void Tick(float DeltaTime) override;

public:
	int32 GetMapConfigId() const { return MapConfigId; }
	const TArray<int32>& GetRedHeroIds() const { return RedHeroIds; }
	const TArray<int32>& GetBlueHeroIds() const { return BlueHeroIds; }

private:
	UPROPERTY(EditAnywhere)
	int32				MapConfigId = 0;
	UPROPERTY(EditAnywhere)
	TArray<int32>		RedHeroIds;
	UPROPERTY(EditAnywhere)
	TArray<int32>		BlueHeroIds;
};
