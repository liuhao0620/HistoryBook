// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "HBWarCursor.h"
#include "HBMovableCursor.generated.h"

class AHBWarHero;
UCLASS(BlueprintType)
class HISTORYBOOK_API AHBMovableCursor : public AHBWarCursor
{
	GENERATED_BODY()

public:
	// Sets default values for this actor's properties
	AHBMovableCursor();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	virtual void NotifyActorOnClicked(FKey ButtonPressed) override;
};
