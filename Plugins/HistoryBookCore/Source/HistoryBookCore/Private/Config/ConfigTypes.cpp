#include "Config/ConfigTypes.h"
#include "Kismet/KismetStringLibrary.h"

FCityConfigSharedPtrType FCityConfigType::ParseFromString(const FString& InConfigStr)
{
	const TArray<FString> SeparatedConfigStrings = UKismetStringLibrary::ParseIntoArray(InConfigStr, TEXT(","), false);
	if (SeparatedConfigStrings.Num() < 14)
	{
		return nullptr;
	}
	FCityConfigSharedPtrType OneCityConfig = MakeShared<FCityConfigType>();
	OneCityConfig->Id = UKismetStringLibrary::Conv_StringToInt64(SeparatedConfigStrings[0]);
	OneCityConfig->Name = SeparatedConfigStrings[1];
	OneCityConfig->Boss = UKismetStringLibrary::Conv_StringToInt64(SeparatedConfigStrings[2]);
	OneCityConfig->Satrap = UKismetStringLibrary::Conv_StringToInt64(SeparatedConfigStrings[3]);
	OneCityConfig->MaxFarm = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[4]);
	OneCityConfig->CurrentFarm = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[5]);
	OneCityConfig->MaxBusiness = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[6]);
	OneCityConfig->CurrentBusiness = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[7]);
	OneCityConfig->Loyal = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[8]);
	OneCityConfig->FangZai = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[9]);
	OneCityConfig->MaxPersonNum = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[10]);
	OneCityConfig->CurrentPersonNum = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[11]);
	OneCityConfig->Money = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[12]);
	OneCityConfig->Food = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[13]);
	return OneCityConfig;
}

FHeroConfigSharedPtrType FHeroConfigType::ParseFromString(const FString& InConfigStr)
{
	const TArray<FString> SeparatedConfigStrings = UKismetStringLibrary::ParseIntoArray(InConfigStr, TEXT(","), false);
	if (SeparatedConfigStrings.Num() < 14)
	{
		return nullptr;
	}
	FHeroConfigSharedPtrType OneHeroConfig = MakeShared<FHeroConfigType>();
	OneHeroConfig->Id = UKismetStringLibrary::Conv_StringToInt64(SeparatedConfigStrings[0]);
	OneHeroConfig->Name = SeparatedConfigStrings[1];
	OneHeroConfig->Boss = UKismetStringLibrary::Conv_StringToInt64(SeparatedConfigStrings[2]);
	OneHeroConfig->Level = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[3]);
	OneHeroConfig->Force = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[4]);
	OneHeroConfig->IQ = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[5]);
	OneHeroConfig->Loyal = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[6]);
	OneHeroConfig->Trait = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[7]);
	OneHeroConfig->ArmyType = StaticCast<EArmyType>(UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[8]));
	OneHeroConfig->Item1 = UKismetStringLibrary::Conv_StringToInt64(SeparatedConfigStrings[9]);
	OneHeroConfig->Item2 = UKismetStringLibrary::Conv_StringToInt64(SeparatedConfigStrings[10]);
	OneHeroConfig->Age = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[11]);
	OneHeroConfig->City = UKismetStringLibrary::Conv_StringToInt64(SeparatedConfigStrings[12]);
	OneHeroConfig->Finder = UKismetStringLibrary::Conv_StringToInt64(SeparatedConfigStrings[13]);
	return OneHeroConfig;
}

FItemConfigSharedPtrType FItemConfigType::ParseFromString(const FString& InConfigStr)
{
	const TArray<FString> SeparatedConfigStrings = UKismetStringLibrary::ParseIntoArray(InConfigStr, TEXT(","), false);
	if (SeparatedConfigStrings.Num() < 10)
	{
		return nullptr;
	}
	FItemConfigSharedPtrType OneItemConfig = MakeShared<FItemConfigType>();
	OneItemConfig->Id = UKismetStringLibrary::Conv_StringToInt64(SeparatedConfigStrings[0]);
	OneItemConfig->Name = SeparatedConfigStrings[1];
	OneItemConfig->Owner = UKismetStringLibrary::Conv_StringToInt64(SeparatedConfigStrings[2]);
	OneItemConfig->UseFlag = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[3]);
	OneItemConfig->Force = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[4]);
	OneItemConfig->IQ = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[5]);
	OneItemConfig->Move = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[6]);
	OneItemConfig->ArmyType = StaticCast<EArmyType>(UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[7]));
	OneItemConfig->City = UKismetStringLibrary::Conv_StringToInt64(SeparatedConfigStrings[8]);
	OneItemConfig->Finder = UKismetStringLibrary::Conv_StringToInt64(SeparatedConfigStrings[9]);
	return OneItemConfig;
}

FStageConfigSharedPtrType FStageConfigType::ParseFromString(const FString& InConfigStr)
{
	const TArray<FString> SeparatedConfigStrings = UKismetStringLibrary::ParseIntoArray(InConfigStr, TEXT(","), false);
	if (SeparatedConfigStrings.Num() < 6)
	{
		return nullptr;
	}
	FStageConfigSharedPtrType OneStageConfig = MakeShared<FStageConfigType>();
	OneStageConfig->Id = UKismetStringLibrary::Conv_StringToInt64(SeparatedConfigStrings[0]);
	OneStageConfig->Name = SeparatedConfigStrings[1];
	OneStageConfig->Year = UKismetStringLibrary::Conv_StringToInt(SeparatedConfigStrings[2]);
	OneStageConfig->CityConfigFileName = SeparatedConfigStrings[3];
	OneStageConfig->HeroConfigFileName = SeparatedConfigStrings[4];
	OneStageConfig->ItemConfigFileName = SeparatedConfigStrings[5];
	return OneStageConfig;
}
