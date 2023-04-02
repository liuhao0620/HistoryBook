// Fill out your copyright notice in the Description page of Project Settings.


#include "Logic/HistoryBookPlayerController.h"
#include "Blueprint/UserWidget.h"


// Sets default values
AHistoryBookPlayerController::AHistoryBookPlayerController()
{
}

// Called when the game starts or when spawned
void AHistoryBookPlayerController::BeginPlay()
{
	Super::BeginPlay();
	SetShowMouseCursor(true);
}

UUserWidget* AHistoryBookPlayerController::SetUserWidget(TSubclassOf<UUserWidget> InUserWidgetClass)
{
	if (CurrentUserWidget != nullptr)
	{
		CurrentUserWidget->RemoveFromParent();
		CurrentUserWidget = nullptr;
	}
	CurrentUserWidget = CreateWidget(this, InUserWidgetClass);
	if (CurrentUserWidget != nullptr)
	{
		CurrentUserWidget->AddToViewport();
	}
	return CurrentUserWidget;
}

