// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "HBWarCursor.h"
#include "HBAttackableCursor.generated.h"

UCLASS()
class HISTORYBOOK_API AHBAttackableCursor : public AHBWarCursor
{
	GENERATED_BODY()

public:
	// Sets default values for this actor's properties
	AHBAttackableCursor();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	virtual void NotifyActorOnClicked(FKey ButtonPressed) override;
};
