// Fill out your copyright notice in the Description page of Project Settings.

#include "Cursor/HBWarCursor.h"
#include "Character/HBWarHero.h"


// Sets default values
AHBWarCursor::AHBWarCursor()
{
	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;
}

// Called when the game starts or when spawned
void AHBWarCursor::BeginPlay()
{
	Super::BeginPlay();
	
}

// Called every frame
void AHBWarCursor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
}

void AHBWarCursor::Init(AHBWarHero* InOwner, const FIntVector2& InPosition)
{
	Owner = InOwner;
	Position = InPosition;
}

