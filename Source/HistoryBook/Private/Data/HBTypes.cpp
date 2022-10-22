#include "Data/HBTypes.h"

#include "Data/HBConstants.h"


EHBLandformType FHBWarMapConfig::GetLandformType(const FIntVector2& InPosition) const
{
	if (InPosition.X < 0 || InPosition.Y < 0 || InPosition.Y >= Landforms.Num() || InPosition.X >= Landforms[InPosition.Y].RowLandforms.Num() )
	{
		return EHBLandformType::Invalid;
	}
	return Landforms[InPosition.Y].RowLandforms[InPosition.X];
}

FVector FHBWarMapConfig::PositionToLocation(const FIntVector2& InPosition) const
{
	const float MapMidY = StaticCast<float>(Width - 1) / 2;
	const float MapMidX = StaticCast<float>(Height - 1) / 2;
	return FVector((StaticCast<float>(InPosition.X) - MapMidX) * FHBCommonConstant::UnrealUnitsPerLandform,
		(StaticCast<float>(InPosition.Y) - MapMidY) * FHBCommonConstant::UnrealUnitsPerLandform,
		0.f);
}
