// Fill out your copyright notice in the Description page of Project Settings.


#include "Cursor/HBMovableCursor.h"
#include "Character/HBWarHero.h"


// Sets default values
AHBMovableCursor::AHBMovableCursor()
{
	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;
}

// Called when the game starts or when spawned
void AHBMovableCursor::BeginPlay()
{
	Super::BeginPlay();
	
}

// Called every frame
void AHBMovableCursor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
}

void AHBMovableCursor::NotifyActorOnClicked(FKey ButtonPressed)
{
	Super::NotifyActorOnClicked(ButtonPressed);

	if (ButtonPressed == EKeys::LeftMouseButton && Owner.IsValid() && Owner->GetWarCamp() == EHBWarCamp::ERed)
	{
		Owner->MoveTo(Position);
		Owner->ClearCursors();
	}
}

