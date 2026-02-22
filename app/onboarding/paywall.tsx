import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import Purchases, { CustomerInfo, PurchasesPackage } from "react-native-purchases";

const hasActiveEntitlement = (customerInfo: CustomerInfo) =>
  Object.keys(customerInfo.entitlements.active).length > 0;

const isWeeklyPackage = (pkg: PurchasesPackage) =>
  pkg.packageType === "WEEKLY" || pkg.product.subscriptionPeriod === "P1W";

const isAnnualPackage = (pkg: PurchasesPackage) =>
  pkg.packageType === "ANNUAL" || pkg.product.subscriptionPeriod === "P1Y";

const isMonthlyPackage = (pkg: PurchasesPackage) =>
  pkg.packageType === "MONTHLY" || pkg.product.subscriptionPeriod === "P1M";

const getPackagePriority = (pkg: PurchasesPackage) => {
  if (isWeeklyPackage(pkg)) return 0;
  if (isAnnualPackage(pkg)) return 1;
  if (isMonthlyPackage(pkg)) return 2;
  return 3;
};

const getPaywallPackages = (packages: PurchasesPackage[]) =>
  [...packages].sort((a, b) => getPackagePriority(a) - getPackagePriority(b));

const getDefaultPackage = (packages: PurchasesPackage[]) => packages[0] ?? null;

const getTargetLabel = (pkg: PurchasesPackage) => {
  if (isWeeklyPackage(pkg)) {
    return pkg.product.pricePerWeekString
      ? `${pkg.product.pricePerWeekString}/WEEK`
      : "Weekly subscription";
  }

  if (isAnnualPackage(pkg)) {
    return pkg.product.pricePerYearString
      ? `${pkg.product.pricePerYearString}/YEAR`
      : "Yearly subscription";
  }

  if (isMonthlyPackage(pkg)) {
    return pkg.product.pricePerMonthString
      ? `${pkg.product.pricePerMonthString}/MONTH`
      : "Monthly subscription";
  }

  return "Auto-renewing subscription";
};

const getPurchaseButtonText = (
  hasSubscription: boolean,
  purchasing: boolean,
  selectedPackage: PurchasesPackage | null
) => {
  if (hasSubscription) return "Continue";
  if (purchasing) return "Processing...";
  if (!selectedPackage) return "Select a Plan";
  
  if (isWeeklyPackage(selectedPackage)) {
    return `Try Free - ${selectedPackage.product.priceString}/week`;
  }
  
  return "Unlock";
};

export default function Paywall() {
  const [packageOptions, setPackageOptions] = useState<PurchasesPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    const loadPaywall = async () => {
      try {
        const customerInfo = await Purchases.getCustomerInfo();
        if (hasActiveEntitlement(customerInfo)) {
          setHasSubscription(true);
        }

        const offerings = await Purchases.getOfferings();
        const currentOffering = offerings.current;

        if (!currentOffering) {
          setPackageOptions([]);
          setSelectedPackage(null);
          return;
        }

        const paywallPackages = getPaywallPackages(currentOffering.availablePackages ?? []);

        if (__DEV__) {
          console.log(
            "RevenueCat current offering",
            currentOffering.identifier,
            paywallPackages.map((pkg) => ({
              packageType: pkg.packageType,
              packageIdentifier: pkg.identifier,
              productIdentifier: pkg.product.identifier,
              period: pkg.product.subscriptionPeriod,
            }))
          );
        }

        setPackageOptions(paywallPackages);
        setSelectedPackage(getDefaultPackage(paywallPackages));
      } catch (error) {
        setErrorText(error instanceof Error ? error.message : "Unable to load paywall.");
      } finally {
        setLoading(false);
      }
    };

    loadPaywall();
  }, []);

  const handlePurchase = async () => {
    if (!selectedPackage) {
      setErrorText("Please select a package before purchasing.");
      return;
    }

    setPurchasing(true);
    setErrorText(null);

    try {
      const { customerInfo } = await Purchases.purchasePackage(selectedPackage);

      if (__DEV__) {
        console.log("Purchase successful, customer info:", {
          activeEntitlements: Object.keys(customerInfo.entitlements.active),
        });
      }

      if (hasActiveEntitlement(customerInfo)) {
        setHasSubscription(true);
        // Navigate after a small delay to ensure state updates
        setTimeout(() => router.push("/core/test"), 500);
      } else {
        setErrorText("Purchase completed but subscription not activated. Please try again.");
      }
    } catch (error: unknown) {
      if ((error as { userCancelled?: boolean })?.userCancelled) {
        if (__DEV__) {
          console.log("User cancelled purchase");
        }
        return;
      }

      const errorMessage = error instanceof Error ? error.message : "Purchase failed.";
      if (__DEV__) {
        console.error("Purchase error:", error);
      }
      setErrorText(errorMessage);
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setPurchasing(true);
    setErrorText(null);

    try {
      const customerInfo = await Purchases.restorePurchases();

      if (__DEV__) {
        console.log("Restore purchases successful:", {
          activeEntitlements: Object.keys(customerInfo.entitlements.active),
        });
      }

      if (hasActiveEntitlement(customerInfo)) {
        setHasSubscription(true);
        setTimeout(() => router.push("/core/test"), 500);
      } else {
        setErrorText("No active subscription found to restore.");
      }
    } catch (error) {
      if (__DEV__) {
        console.error("Restore error:", error);
      }
      setErrorText(error instanceof Error ? error.message : "Restore failed.");
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <StatusBar barStyle="light-content" />
      <View className="flex-1 px-8 py-12 justify-between">
        <View>
          <View className="flex-row items-center justify-between mb-10">
            <TouchableOpacity
              onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
              className="w-12 h-12 items-center justify-center border border-white/10 rounded-xl bg-gray-900/50"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <View className="flex-1 ml-6 h-[1px] bg-gray-900">
              <View className="h-[1px] bg-white w-[100%]" />
            </View>
          </View>

          <Text className="text-gray-600 text-[10px] font-bold tracking-[4px] uppercase mb-1">
            Final Step
          </Text>
          <Text className="text-white text-5xl font-black italic uppercase tracking-tighter">
            Paywall.
          </Text>
        </View>

        <View className="relative py-8">
          <View className="absolute top-0 left-0 w-10 h-[1.5px] bg-white/20" />
          <View className="absolute top-0 left-0 w-[1.5px] h-10 bg-white/20" />
          <View className="absolute bottom-0 right-0 w-10 h-[1.5px] bg-white/20" />
          <View className="absolute bottom-0 right-0 w-[1.5px] h-10 bg-white/20" />

          <Text className="text-gray-300 text-lg leading-7 mb-2">
            Unlock your full training plan and adaptive progression engine.
          </Text>
          <Text className="text-white text-sm font-black italic uppercase tracking-[2px] mb-6">
            Choose the plan that fits your goals.
          </Text>

          {loading ? (
            <Text className="text-gray-400 text-base font-semibold uppercase tracking-[2px]">
              Loading Plans...
            </Text>
          ) : null}

          {!loading && hasSubscription ? (
            <View className="bg-white rounded-2xl px-6 py-6 border border-white">
              <Text className="text-black text-2xl font-black italic uppercase tracking-tight">
                Subscription Active
              </Text>
              <Text className="text-gray-700 text-[11px] font-bold uppercase tracking-[2px] mt-2">
                Your account already has access.
              </Text>
            </View>
          ) : null}

          {!loading && !hasSubscription ? (
            <View>
              {packageOptions.map((pkg) => {
                const isSelected = selectedPackage?.identifier === pkg.identifier;
                const targetLabel = getTargetLabel(pkg);
                const isWeekly = isWeeklyPackage(pkg);

                return (
                  <TouchableOpacity
                    key={pkg.identifier}
                    onPress={() => setSelectedPackage(pkg)}
                    activeOpacity={0.9}
                    className={`w-full py-6 px-7 rounded-2xl border mb-4 ${
                      isSelected ? "bg-white border-white" : "bg-gray-900/40 border-white/10"
                    }`}
                  >
                    <View className="flex-row justify-between items-center">
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2 mb-1">
                          <Text
                            className={`text-2xl font-black italic uppercase tracking-tight ${
                              isSelected ? "text-black" : "text-white"
                            }`}
                          >
                            {pkg.product.title}
                          </Text>
                          {isWeekly && (
                            <View className={`px-2 py-1 rounded-full ${isSelected ? "bg-black/10" : "bg-white/10"}`}>
                              <Text className={`text-[9px] font-bold uppercase tracking-[1px] ${
                                isSelected ? "text-black" : "text-white"
                              }`}>
                                TRY FREE
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text
                          className={`text-[10px] font-bold uppercase tracking-[2px] mt-1 ${
                            isSelected ? "text-gray-600" : "text-gray-500"
                          }`}
                        >
                          {targetLabel ?? "Auto-renewing subscription"}
                        </Text>
                      </View>
                      <Text
                        className={`text-lg font-black italic ${
                          isSelected ? "text-black" : "text-white"
                        }`}
                      >
                        {pkg.product.priceString}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}

          {!loading && !hasSubscription && packageOptions.length === 0 ? (
            <Text className="text-red-400 text-sm font-semibold">
              No subscription packages available in your current RevenueCat offering.
            </Text>
          ) : null}
        </View>

        <View>
          {errorText ? (
            <Text className="text-red-400 text-[11px] font-bold uppercase tracking-[1.5px] mb-4">
              {errorText}
            </Text>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.9}
            disabled={loading || purchasing || (!hasSubscription && !selectedPackage)}
            onPress={hasSubscription ? () => router.push("/core/test") : handlePurchase}
            className={`h-20 rounded-xl flex-row items-center justify-between px-8 mb-4 ${
              loading || purchasing || (!hasSubscription && !selectedPackage)
                ? "bg-gray-700 opacity-50"
                : "bg-white"
            }`}
          >
            <Text className="text-black text-2xl font-black italic uppercase tracking-tighter">
              {getPurchaseButtonText(hasSubscription, purchasing, selectedPackage)}
            </Text>
            <Ionicons name="chevron-forward" size={28} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRestore} disabled={purchasing} className="py-2">
            <Text className="text-gray-500 text-center text-[11px] font-bold uppercase tracking-[2px]">
              Restore Purchases
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

