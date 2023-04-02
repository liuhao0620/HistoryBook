#pragma once
#include "Adpter/CoreTypes.h"
#include "Config/ConfigTypes.h"

struct FCityDataType;
struct FHeroDataType;
struct FItemDataType;
struct FCampDataType;
using FCityDataSharedPtrType = TSharedPtr<FCityDataType>;
using FHeroDataSharedPtrType = TSharedPtr<FHeroDataType>;
using FItemDataSharedPtrType = TSharedPtr<FItemDataType>;
using FCampDataSharedPtrType = TSharedPtr<FCampDataType>;

struct HISTORYBOOKCORE_API FCityDataType
{
	FCityConfigSharedPtrType		Config;
	FHeroDataSharedPtrType			Boss;
	FHeroDataSharedPtrType			Satrap;
	int32							CurrentFarm = 0;
	int32							CurrentBusiness = 0;
	int32							Loyal = 0;
	int32							FangZai = 0;
	int32							CurrentPersonNum = 0;
	int32							Money = 0;
	int32							Food = 0;
	int32							TroopsNum = 0;
	TArray<FHeroDataSharedPtrType>	Heroes;
	TArray<FHeroDataSharedPtrType>	UnFoundHeroes;
	TArray<FItemDataSharedPtrType>	UnFoundItems;
};

struct HISTORYBOOKCORE_API FHeroDataType
{
	FHeroConfigSharedPtrType	Config;
	int32						Level = 0;
	int32						Force = 0;
	int32						IQ = 0;
	EArmyType					ArmyType = EArmyType::Infantry;
	int32						Age = 0;
	int32						Move = 0;
	int32						Exp = 0;
	int32						Thew = 0;
	int32						TroopsNum = 0;
	FItemDataSharedPtrType		Item1;
	FItemDataSharedPtrType		Item2;

	FHeroDataType(FHeroConfigSharedPtrType InConfig);
};

struct HISTORYBOOKCORE_API FItemDataType
{
	FItemDataSharedPtrType		Config;
};

struct HISTORYBOOKCORE_API FCampDataType
{
	FHeroDataSharedPtrType				Boss;
	TMap<int64, FCityDataSharedPtrType>	Cities;
	TMap<int64, FHeroDataSharedPtrType>	Heroes;
	TMap<int64, FItemDataSharedPtrType>	UnUsedItems;
};
