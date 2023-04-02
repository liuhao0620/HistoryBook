#pragma once
#include "Adpter/CoreTypes.h"

enum class HISTORYBOOKCORE_API ECityState : uint8
{
	Normal,		//正常
	Famine,		//饥荒
	Drought,	//干旱
	Flood,		//洪水
	Riot,		//暴乱
};

enum class HISTORYBOOKCORE_API EArmyType : uint8
{
	Rider,		//骑兵
	Infantry,	//步兵
	Archer,		//弓兵
	Sailor,		//水兵
	Ghost,		//极兵
	Magic,		//玄兵
};

struct FCityConfigType;
struct FHeroConfigType;
struct FItemConfigType;
struct FStageConfigType;
using FCityConfigSharedPtrType = TSharedPtr<FCityConfigType>;
using FHeroConfigSharedPtrType = TSharedPtr<FHeroConfigType>;
using FItemConfigSharedPtrType = TSharedPtr<FItemConfigType>;
using FStageConfigSharedPtrType = TSharedPtr<FStageConfigType>;

struct HISTORYBOOKCORE_API FCityConfigType
{
	int64 Id = 0LL;
	FString Name;
	int64 Boss = 0LL;
	int64 Satrap = 0LL;
	int32 MaxFarm = 0;
	int32 CurrentFarm = 0;
	int32 MaxBusiness = 0;
	int32 CurrentBusiness = 0;
	int32 Loyal = 0;
	int32 FangZai = 0;
	int32 MaxPersonNum = 0;
	int32 CurrentPersonNum = 0;
	int32 Money = 0;
	int32 Food = 0;

	static FCityConfigSharedPtrType ParseFromString(const FString& InConfigStr);
};

struct HISTORYBOOKCORE_API FHeroConfigType
{
	int64 Id = 0LL;
	FString Name;
	int64 Boss = 0LL;
	int32 Level = 0;
	int32 Force = 0;
	int32 IQ = 0;
	int32 Loyal = 0;
	int32 Trait = 0;		// 性格
	EArmyType ArmyType = EArmyType::Infantry;
	int64 Item1 = 0LL;
	int64 Item2 = 0LL;
	int32 Age = 0;
	int64 City = 0LL;
	int64 Finder = 0LL;

	static FHeroConfigSharedPtrType ParseFromString(const FString& InConfigStr);
};

struct HISTORYBOOKCORE_API FItemConfigType
{
	int64 Id = 0LL;
	FString Name;
	int64 Owner = 0LL;
	int32 UseFlag = 0;
	int32 Force = 0;
	int32 IQ = 0;
	int32 Move = 0;
	EArmyType ArmyType = EArmyType::Infantry;
	int64 City = 0LL;
	int64 Finder = 0LL;
	
	static FItemConfigSharedPtrType ParseFromString(const FString& InConfigStr);
};

struct HISTORYBOOKCORE_API FStageConfigType
{
	int64 Id = 0LL;
	FString Name;
	int32 Year = 0;
	FString CityConfigFileName;
	FString HeroConfigFileName;
	FString ItemConfigFileName;

	TMap<int64, FCityConfigSharedPtrType>		CityConfigs;
	TMap<int64, FHeroConfigSharedPtrType>		HeroConfigs;
	TMap<int64, FItemConfigSharedPtrType>		ItemConfigs;

	static FStageConfigSharedPtrType ParseFromString(const FString& InConfigStr);
};
