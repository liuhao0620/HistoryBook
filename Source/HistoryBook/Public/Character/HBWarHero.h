// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "Data/HBTypes.h"
#include "HBWarHero.generated.h"

UCLASS()
class HISTORYBOOK_API AHBWarHero : public ACharacter
{
	GENERATED_BODY()

public:
	// Sets default values for this character's properties
	AHBWarHero();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	// Called to bind functionality to input
	virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;

	virtual void NotifyActorOnClicked(FKey ButtonPressed = EKeys::LeftMouseButton) override;

public:
	void InitParameters(int32 InConfigId, FIntVector2 InPosition, int32 InLevel = 1, int32 InSoldierCount = -1);
	
public:
	UFUNCTION(BlueprintCallable)
	FName GetHeroName() const;
	UFUNCTION(BlueprintCallable)
	int32 GetHeroLevel() const;
	UFUNCTION(BlueprintCallable)
	int32 GetSoldierCount() const;
	UFUNCTION(BlueprintCallable)
	int32 GetMaxSoldierCount() const;

private:
	void DisplayMovableCursors() const;

private:
	int32			ConfigId = 0;
	FIntVector2		Position = FIntVector2(0, 0);
	int32			Level = 0;
	int32			SoldierCount = 0;
	FName			Name;
	EHBMilitaryType MilitaryType = EHBMilitaryType::Invalid;
	int32			MaxSoldierCount = 0;
};
