#pragma once

#include "CoreMinimal.h"
#include "Engine/DataTable.h"
#include "HBTypes.generated.h"

class AHBWarHero;

UENUM(BlueprintType)
enum class EHBLandformType : uint8
{
	Invalid UMETA(Hidden),
	ROAD UMETA(DisplayName="道路"),
};

UENUM(BlueprintType)
enum class EHBMilitaryType : uint8
{
	Invalid UMETA(Hidden),
	Infantry UMETA(DisplayName="步兵"),
};

USTRUCT(BlueprintType)
struct FHBLandformConfig : public FTableRowBase
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere)
	EHBLandformType				Type = EHBLandformType::Invalid;
	UPROPERTY(EditAnywhere)
	FName						Name;
	UPROPERTY(EditAnywhere)
	int32						MobilityCost = 1;	// 移动开销
	UPROPERTY(EditAnywhere)
	TSubclassOf<AActor>			ActorClass;
};

USTRUCT(BlueprintType)
struct FHBMilitaryConfig : public FTableRowBase
{
	GENERATED_BODY()
	
	UPROPERTY(EditAnywhere)
	EHBMilitaryType				Type = EHBMilitaryType::Invalid;
	UPROPERTY(EditAnywhere)
	FName						Name;
	UPROPERTY(EditAnywhere)
	int32						Mobility = 4;		// 移动力
	UPROPERTY(EditAnywhere)
	TArray<FVector2D>			AttackRange;		// 攻击范围
	UPROPERTY(EditAnywhere)
	TSubclassOf<AHBWarHero>		PawnClass;			// 模型类型
};

USTRUCT(BlueprintType)
struct FHBHeroConfig : public FTableRowBase
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere)
	int32						Id = 0;
	UPROPERTY(EditAnywhere)
	FName						Name;
	UPROPERTY(EditAnywhere)
	EHBMilitaryType				DefaultMilitaryType = EHBMilitaryType::Invalid;
	UPROPERTY(EditAnywhere)
	int32						Force = 0;			// 武力
	UPROPERTY(EditAnywhere)
	int32						Intellect = 0;		// 智力
};

USTRUCT(BlueprintType)
struct FHBWarMapRowConfig
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere)
	TArray<EHBLandformType>		RowLandforms;
};

USTRUCT(BlueprintType)
struct FHBWarMapConfig : public FTableRowBase
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere)
	int32						Id = 0;
	UPROPERTY(EditAnywhere)
	FName						Name;
	UPROPERTY(EditAnywhere)
	int32						Width = 21;			// 横向有多少个地块
	UPROPERTY(EditAnywhere)
	int32						Height = 21;		// 纵向有多少个地块
	UPROPERTY(EditAnywhere)
	int32						RedBirthPointX = 0;	// 红方出生地点X
	UPROPERTY(EditAnywhere)
	int32						RedBirthPointY = 0;	// 红方出生地点Y
	UPROPERTY(EditAnywhere)
	int32						BlueBirthPointX = 0;// 蓝方出生地点X
	UPROPERTY(EditAnywhere)
	int32						BlueBirthPointY = 0;// 蓝方出生地点Y
	UPROPERTY(EditAnywhere)
	TArray<FHBWarMapRowConfig>	Landforms;

	EHBLandformType GetLandformType(const FIntVector2& InPosition) const;
	FVector PositionToLocation(const FIntVector2& InPosition) const;
};
