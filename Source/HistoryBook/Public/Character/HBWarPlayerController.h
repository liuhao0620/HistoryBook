﻿// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "HBWarPlayerController.generated.h"

class AHBWarHero;
UCLASS()
class HISTORYBOOK_API AHBWarPlayerController : public APlayerController
{
	GENERATED_BODY()

public:
	// Sets default values for this actor's properties
	AHBWarPlayerController();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:
	// Called every frame
	virtual void Tick(float DeltaTime) override;

public:
	void SetControlledHero(AHBWarHero* InHero);
	TWeakObjectPtr<AHBWarHero> GetControlledHero() const;

private:
	TWeakObjectPtr<AHBWarHero>			ControlledHero;
};
