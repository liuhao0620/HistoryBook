// Fill out your copyright notice in the Description page of Project Settings.
#include "Cursor/HBAttackableCursor.h"
#include "Character/HBWarHero.h"

// Sets default values
AHBAttackableCursor::AHBAttackableCursor()
{
	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;
}

// Called when the game starts or when spawned
void AHBAttackableCursor::BeginPlay()
{
	Super::BeginPlay();
	
}

// Called every frame
void AHBAttackableCursor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
}

void AHBAttackableCursor::NotifyActorOnClicked(FKey ButtonPressed)
{
	Super::NotifyActorOnClicked(ButtonPressed);

	if (ButtonPressed == EKeys::LeftMouseButton && Owner.IsValid() && Owner->GetWarCamp() == EHBWarCamp::ERed)
	{
		Owner->Attack(nullptr);
		Owner->ClearCursors();
	}
}

