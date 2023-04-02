#include "RuntimeData/RuntimeDataType.h"

FHeroDataType::FHeroDataType(FHeroConfigSharedPtrType InConfig)
	: Config(InConfig)
	, Level(InConfig->Level)
	, Force(InConfig->Force)
	, IQ(InConfig->IQ)
	, ArmyType(InConfig->ArmyType)
	, Age(InConfig->Age)
{
}
