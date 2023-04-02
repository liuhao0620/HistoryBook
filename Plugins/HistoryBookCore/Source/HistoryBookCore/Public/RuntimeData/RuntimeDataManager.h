// Fill out your copyright notice in the Description page of Project Settings.
#pragma once
#include "CoreMinimal.h"
#include "RuntimeDataType.h"

/**
 * 
 */
class HISTORYBOOKCORE_API FRuntimeDataManager
{
public:
	FRuntimeDataManager();
	~FRuntimeDataManager();

	bool Init(int64 InStageId);
	void Clear();

private:
	int64								StageId = 0;
	TArray<FCampDataSharedPtrType>		AllCampData;
	TMap<int64, FCityDataSharedPtrType>	AllCityData;
	TMap<int64, FHeroDataSharedPtrType>	AllHeroData;
};
