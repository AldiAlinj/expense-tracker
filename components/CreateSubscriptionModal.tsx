import { icons } from "@/constants/icons";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

type Frequency = "Monthly" | "Yearly";

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

type Category = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<Category, string> = {
  Entertainment: "#ffd6e0",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#b8e8d0",
  Productivity: "#f6eecf",
  Cloud: "#d0e8f5",
  Music: "#f5c542",
  Other: "#e0d5f5",
};

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
}

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onSubmit,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("Monthly");
  const [category, setCategory] = useState<Category | "">("");
  const [nameTouched, setNameTouched] = useState(false);
  const [priceTouched, setPriceTouched] = useState(false);

  const parsedPrice = parseFloat(price);
  const nameValid = name.trim().length > 0;
  const priceValid = !isNaN(parsedPrice) && parsedPrice > 0;
  const formValid = nameValid && priceValid;

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("");
    setNameTouched(false);
    setPriceTouched(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    setNameTouched(true);
    setPriceTouched(true);
    if (!formValid) return;

    const now = dayjs();
    const renewalDate =
      frequency === "Monthly"
        ? now.add(1, "month").toISOString()
        : now.add(1, "year").toISOString();

    const newSubscription: Subscription = {
      id: `custom-${Date.now()}`,
      icon: icons.wallet,
      name: name.trim(),
      price: parsedPrice,
      currency: "USD",
      billing: frequency,
      category: category || undefined,
      status: "active",
      startDate: now.toISOString(),
      renewalDate,
      color: category ? CATEGORY_COLORS[category as Category] : "#e0d5f5",
    };

    onSubmit(newSubscription);
    resetForm();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="modal-overlay">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <View className="modal-container">
            {/* Header */}
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable className="modal-close" onPress={handleClose}>
                <Text className="modal-close-text">✕</Text>
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="modal-body pb-8">
                {/* Name */}
                <View className="auth-field">
                  <Text className="auth-label">Name</Text>
                  <TextInput
                    className={clsx(
                      "auth-input",
                      nameTouched && !nameValid && "auth-input-error",
                    )}
                    placeholder="e.g. Netflix"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    value={name}
                    onChangeText={setName}
                    onBlur={() => setNameTouched(true)}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                  {nameTouched && !nameValid && (
                    <Text className="auth-error">Name is required</Text>
                  )}
                </View>

                {/* Price */}
                <View className="auth-field">
                  <Text className="auth-label">Price (USD)</Text>
                  <TextInput
                    className={clsx(
                      "auth-input",
                      priceTouched && !priceValid && "auth-input-error",
                    )}
                    placeholder="e.g. 9.99"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    value={price}
                    onChangeText={setPrice}
                    onBlur={() => setPriceTouched(true)}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                  />
                  {priceTouched && !priceValid && (
                    <Text className="auth-error">
                      Enter a valid positive price
                    </Text>
                  )}
                </View>

                {/* Frequency */}
                <View className="auth-field">
                  <Text className="auth-label">Billing Frequency</Text>
                  <View className="picker-row">
                    {(["Monthly", "Yearly"] as Frequency[]).map((option) => (
                      <Pressable
                        key={option}
                        className={clsx(
                          "picker-option",
                          frequency === option && "picker-option-active",
                        )}
                        onPress={() => setFrequency(option)}
                      >
                        <Text
                          className={clsx(
                            "picker-option-text",
                            frequency === option && "picker-option-text-active",
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Category */}
                <View className="auth-field">
                  <Text className="auth-label">Category (optional)</Text>
                  <View className="category-scroll">
                    {CATEGORIES.map((cat) => (
                      <Pressable
                        key={cat}
                        className={clsx(
                          "category-chip",
                          category === cat && "category-chip-active",
                        )}
                        onPress={() =>
                          setCategory((current) => (current === cat ? "" : cat))
                        }
                      >
                        <Text
                          className={clsx(
                            "category-chip-text",
                            category === cat && "category-chip-text-active",
                          )}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Submit */}
                <Pressable
                  className={clsx(
                    "auth-button",
                    !formValid && "auth-button-disabled",
                  )}
                  onPress={handleSubmit}
                  disabled={!formValid}
                >
                  <Text className="auth-button-text">Add Subscription</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CreateSubscriptionModal;
