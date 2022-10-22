// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "HBTypes.h"
#include "HBConfigManager.generated.h"

class AHBMovableCursor;
class AHBAttackableCursor;
/**
 * 
 */
UCLASS(BlueprintType, Blueprintable)
class HISTORYBOOK_API UHBConfigManager : public UObject
{
	GENERATED_BODY()

public:
	virtual void Initialize();

public:
	const FHBLandformConfig* GetLandformConfig(EHBLandformType InType) const { return LandformConfigs.Find(InType); }
	const FHBMilitaryConfig* GetMilitaryConfig(EHBMilitaryType InType) const  { return MilitaryConfigs.Find(InType); }
	const FHBHeroConfig* GetHeroConfig(int32 InHeroId) const { return HeroConfigs.Find(InHeroId); }
	const FHBWarMapConfig* GetWarMapConfig(int32 InWarMapId) const  { return WarMapConfigs.Find(InWarMapId); }
	const TSubclassOf<AHBMovableCursor>& GetMovableCursorClass() const { return MovableCursorClass; }
	const TSubclassOf<AHBAttackableCursor>& GetAttackableCursorClass() const { return AttackCursorClass; }

private:
	UPROPERTY()
	TMap<EHBLandformType, FHBLandformConfig>	LandformConfigs;
	UPROPERTY()
	TMap<EHBMilitaryType, FHBMilitaryConfig>	MilitaryConfigs;
	UPROPERTY()
	TMap<int32, FHBHeroConfig>					HeroConfigs;
	UPROPERTY()
	TMap<int32, FHBWarMapConfig>				WarMapConfigs;
	
	UPROPERTY(EditDefaultsOnly)
	UDataTable*									LandformConfigDataTable;
	UPROPERTY(EditDefaultsOnly)
	UDataTable*									MilitaryConfigDataTable;
	UPROPERTY(EditDefaultsOnly)
	UDataTable*									HeroConfigDataTable;	
	UPROPERTY(EditDefaultsOnly)
	UDataTable*									WarMapConfigDataTable;
	UPROPERTY(EditDefaultsOnly)
	TSubclassOf<AHBMovableCursor>				MovableCursorClass;
	UPROPERTY(EditDefaultsOnly)
	TSubclassOf<AHBAttackableCursor>				AttackCursorClass;
};
