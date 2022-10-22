// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "HBWarCursor.generated.h"

class AHBWarHero;
UCLASS()
class HISTORYBOOK_API AHBWarCursor : public AActor
{
	GENERATED_BODY()

public:
	// Sets default values for this actor's properties
	AHBWarCursor();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	virtual void Init(AHBWarHero* InOwner, const FIntVector2& InPosition);

protected:
	TWeakObjectPtr<AHBWarHero>			Owner;
	FIntVector2							Position;
};
