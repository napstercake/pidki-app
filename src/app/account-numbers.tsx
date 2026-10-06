import { AlertDialog } from "@/components/authorable/AlertDialog";
import { Badge } from "@/components/authorable/Badge";
import { Box } from "@/components/authorable/Box";
import { Button } from "@/components/authorable/Button";
import { Card } from "@/components/authorable/Card";
import Gradient from "@/components/authorable/Gradient";
import IconButton from "@/components/authorable/IconButton";
import { LoadingSpinner } from "@/components/authorable/LoadingSpinner";
import { Text } from "@/components/authorable/Text";
import { TextField } from "@/components/authorable/TextField";
import {
  useAddBankAccount,
  useDeleteBankAccount,
  useSetDefaultBankAccount,
  useUpdateBankAccount,
} from "@/hooks/mutations/useUserMutations";
import { useBankAccounts } from "@/hooks/queries/useUser";
import { Theme } from "@/theme";
import { BankAccount as ApiBankAccount } from "@/types/api";
import { bankAccountSchema, validateForm } from "@/utils/validations";
import { useTheme } from "@shopify/restyle";
import * as Clipboard from "expo-clipboard";
import { router, Stack } from "expo-router";
import {
  Banknote,
  Check,
  ChevronLeft,
  Copy,
  Edit3,
  PlusCircle,
  Star,
  Trash2,
  X,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";

interface BankAccount {
  id: string;
  bank: string;
  cc: string;
  cci: string;
  tipo: "Soles" | "Dolares";
  isDefault: boolean;
  color: keyof Theme["colors"];
}

const bankColors: (keyof Theme["colors"])[] = [
  "bankBlue",
  "bankGreen",
  "bankPurple",
  "bankOrange",
];

// Helper to map API bank account to UI bank account
function mapApiToUi(account: ApiBankAccount, idx: number): BankAccount {
  // Infer tipo from name or cci/cc (simple heuristic)
  let tipo: "Soles" | "Dolares" = "Soles";
  if (
    /dolares|usd|dólares/i.test(account.name) ||
    /usd/i.test(account.cc) ||
    /usd/i.test(account.cci)
  ) {
    tipo = "Dolares";
  }
  return {
    id: account.id,
    bank: account.name,
    cc: account.cc,
    cci: account.cci,
    tipo,
    isDefault: account.defaultAccount,
    color: bankColors[idx % bankColors.length],
  };
}

export default function AccountNumbersScreen() {
  const theme = useTheme<Theme>();
  const { data, isLoading } = useBankAccounts();
  const accounts: BankAccount[] = (data?.data.bankAccounts ?? []).map((a, i) =>
    mapApiToUi(a, i),
  );
  const addBankAccount = useAddBankAccount();
  const updateBankAccount = useUpdateBankAccount();
  const deleteBankAccount = useDeleteBankAccount();
  const setDefaultBankAccount = useSetDefaultBankAccount();

  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(
    null,
  );
  const [formData, setFormData] = useState({
    bank: "",
    cc: "",
    cci: "",
    tipo: "Soles" as "Soles" | "Dolares",
  });

  // Dialog states
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleAddAccount = async () => {
    setFormErrors({});

    const { isValid, errors: validationErrors } = await validateForm(
      bankAccountSchema,
      { bank: formData.bank, cc: formData.cc, cci: formData.cci },
    );

    if (!isValid) {
      setFormErrors(validationErrors);
      return;
    }

    try {
      await addBankAccount.mutateAsync({
        name: formData.bank,
        cc: formData.cc,
        cci: formData.cci,
        defaultAccount: accounts.length === 0,
      });
      setFormData({ bank: "", cc: "", cci: "", tipo: "Soles" });
      setIsAddingAccount(false);
      setDialogTitle("Listo!");
      setDialogMessage("Cuenta agregada correctamente");
      setShowSuccessDialog(true);
    } catch (e: any) {
      setDialogTitle("Error");
      setDialogMessage(e.message || "No se pudo agregar la cuenta");
      setShowErrorDialog(true);
    }
  };

  const handleEditAccount = async () => {
    if (!editingAccount) return;

    setFormErrors({});

    const { isValid, errors: validationErrors } = await validateForm(
      bankAccountSchema,
      { bank: formData.bank, cc: formData.cc, cci: formData.cci },
    );

    if (!isValid) {
      setFormErrors(validationErrors);
      return;
    }

    try {
      await updateBankAccount.mutateAsync({
        id: editingAccount.id,
        data: { name: formData.bank, cc: formData.cc, cci: formData.cci },
      });
      setEditingAccount(null);
      setFormData({ bank: "", cc: "", cci: "", tipo: "Soles" });
      setDialogTitle("Listo!");
      setDialogMessage("Cuenta actualizada correctamente");
      setShowSuccessDialog(true);
    } catch (e: any) {
      setDialogTitle("Error");
      setDialogMessage(e.message || "No se pudo editar la cuenta");
      setShowErrorDialog(true);
    }
  };

  const handleDeleteAccount = (accountId: string) => {
    const account = accounts.find((acc) => acc.id === accountId);
    if (account?.isDefault && accounts.length > 1) {
      setDialogTitle("Error");
      setDialogMessage(
        "No puedes eliminar la cuenta por defecto. Primero marca otra cuenta como predeterminada.",
      );
      setShowErrorDialog(true);
      return;
    }
    setAccountToDelete(accountId);
    setDialogTitle("Eliminar cuenta");
    setDialogMessage("¿Estás seguro de que quieres eliminar esta cuenta?");
    setShowDeleteDialog(true);
  };

  const confirmDeleteAccount = async () => {
    if (!accountToDelete) return;
    try {
      await deleteBankAccount.mutateAsync(accountToDelete);
      setShowDeleteDialog(false);
      setAccountToDelete(null);
      setDialogTitle("Listo!");
      setDialogMessage("Cuenta eliminada correctamente");
      setShowSuccessDialog(true);
    } catch (e: any) {
      setDialogTitle("Error");
      setDialogMessage(e.message || "No se pudo eliminar la cuenta");
      setShowErrorDialog(true);
    }
  };

  const handleSetDefault = async (accountId: string) => {
    try {
      await setDefaultBankAccount.mutateAsync(accountId);
      setDialogTitle("Listo!");
      setDialogMessage("Cuenta marcada como predeterminada");
      setShowSuccessDialog(true);
    } catch (e: any) {
      setDialogTitle("Error");
      setDialogMessage(e.message || "No se pudo marcar como predeterminada");
      setShowErrorDialog(true);
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    setDialogTitle("Copiado");
    setDialogMessage("Número de cuenta copiado al portapapeles");
    setShowCopyDialog(true);
  };

  const startEditing = (account: BankAccount) => {
    setEditingAccount(account);
    setFormData({
      bank: account.bank,
      cc: account.cc,
      cci: account.cci,
      tipo: account.tipo,
    });
  };

  const cancelEditing = () => {
    setEditingAccount(null);
    setFormData({ bank: "", cc: "", cci: "", tipo: "Soles" });
    setFormErrors({});
  };

  const renderAccountCard = (account: BankAccount) => (
    <Card key={account.id} padding="l" marginBottom="m">
      {/* Header Section */}
      <Box
        flexDirection="row"
        alignItems="flex-start"
        justifyContent="space-between"
        marginBottom="m"
      >
        <Box flexDirection="row" alignItems="center" flex={1}>
          {/* Bank Icon */}
          <Box
            width={48}
            height={48}
            borderRadius="m"
            backgroundColor="gray100"
            justifyContent="center"
            alignItems="center"
            marginRight="m"
          >
            <Banknote size={24} color={theme.colors.textSecondary} />
          </Box>

          {/* Bank Info */}
          <Box flex={1}>
            <Text
              variant="subtitle"
              color="text"
              fontWeight="bold"
              marginBottom="xs"
            >
              {account.bank}
            </Text>
            <Text variant="caption" color="textSecondary">
              {account.tipo}
            </Text>
          </Box>
        </Box>

        {/* Default Badge */}
        {account.isDefault && (
          <Badge variant="primary" size="large">
            <Star size={18} color={theme.colors.white} />
          </Badge>
        )}
      </Box>

      {/* Account Details Section */}
      <Box gap="s" marginBottom="m">
        {/* CC Number */}
        <Box>
          <Text variant="caption" color="textSecondary" marginBottom="xs">
            CC
          </Text>
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text
              variant="body"
              fontFamily="monospace"
              color="textSecondary"
              fontWeight="bold"
            >
              {account.cc}
            </Text>
            <TouchableOpacity
              onPress={() => handleCopyToClipboard(account.cc)}
              style={{ padding: 4 }}
            >
              <Copy size={16} color={theme.colors.gray400} />
            </TouchableOpacity>
          </Box>
        </Box>

        {/* CCI Number */}
        <Box>
          <Text variant="caption" color="textSecondary" marginBottom="xs">
            CCI
          </Text>
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text
              variant="body"
              fontFamily="monospace"
              color="textSecondary"
              fontWeight="bold"
            >
              {account.cci}
            </Text>
            <TouchableOpacity
              onPress={() => handleCopyToClipboard(account.cci)}
              style={{ padding: 4 }}
            >
              <Copy size={16} color={theme.colors.gray400} />
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>

      {/* Action Buttons Section */}
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {/* Set as Default Button */}
        {!account.isDefault ? (
          <Button
            title="Hacer predeterminada"
            variant="outline"
            onPress={() => handleSetDefault(account.id)}
            size="small"
          />
        ) : (
          <Box />
        )}

        {/* Edit and Delete Buttons */}
        <Box flexDirection="row" gap="s" marginTop="s">
          <TouchableOpacity onPress={() => startEditing(account)}>
            <Edit3
              size={20}
              color={theme.colors.secondary}
              style={{ marginRight: theme.spacing.s }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteAccount(account.id)}>
            <Trash2
              size={20}
              color={theme.colors.red500}
              style={{ marginRight: 3 }}
            />
          </TouchableOpacity>
        </Box>
      </Box>
    </Card>
  );

  const renderForm = () => (
    <Card padding="l" marginBottom="l">
      <Box flexDirection="row" alignItems="center" marginBottom="m">
        <Text
          variant="subtitle"
          color="text"
          style={{ flex: 1 }}
          marginBottom="s"
        >
          {editingAccount ? "Editar cuenta" : "Agregar nueva cuenta"}
        </Text>
        <TouchableOpacity
          onPress={
            editingAccount
              ? cancelEditing
              : () => {
                  setIsAddingAccount(false);
                  setFormErrors({});
                }
          }
        >
          <X size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </Box>

      <Box gap="m">
        <TextField
          label="Banco"
          placeholder="Ej: American Bank"
          value={formData.bank}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, bank: text }))
          }
          variant="outlined"
          error={formErrors.bank}
        />

        <TextField
          label="Número de cuenta (CC)"
          placeholder="123-123-123123123-123123"
          value={formData.cc}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, cc: text }))
          }
          variant="outlined"
          error={formErrors.cc}
        />

        <TextField
          label="CCI"
          placeholder="12312333-123123-123123123"
          value={formData.cci}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, cci: text }))
          }
          variant="outlined"
          error={formErrors.cci}
        />

        <Box>
          <Text variant="body" color="textSecondary" marginBottom="s">
            Tipo de moneda
          </Text>
          <Box flexDirection="row" gap="s">
            <TouchableOpacity
              onPress={() =>
                setFormData((prev) => ({ ...prev, tipo: "Soles" }))
              }
              style={{
                flex: 1,
                padding: theme.spacing.m,
                borderRadius: theme.borderRadii.s,
                borderWidth: 1,
                borderColor:
                  formData.tipo === "Soles"
                    ? theme.colors.secondary
                    : theme.colors.gray200,
                backgroundColor:
                  formData.tipo === "Soles"
                    ? theme.colors.secondary
                    : "transparent",
                alignItems: "center",
              }}
            >
              <Text
                variant="body"
                color={formData.tipo === "Soles" ? "white" : "text"}
                fontWeight="600"
              >
                Soles
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setFormData((prev) => ({ ...prev, tipo: "Dolares" }))
              }
              style={{
                flex: 1,
                padding: theme.spacing.m,
                borderRadius: theme.borderRadii.s,
                borderWidth: 1,
                borderColor:
                  formData.tipo === "Dolares"
                    ? theme.colors.purple500
                    : theme.colors.gray200,
                backgroundColor:
                  formData.tipo === "Dolares"
                    ? theme.colors.purple500
                    : "transparent",
                alignItems: "center",
              }}
            >
              <Text
                variant="body"
                color={formData.tipo === "Dolares" ? "white" : "text"}
                fontWeight="600"
              >
                Dólares
              </Text>
            </TouchableOpacity>
          </Box>
        </Box>

        <Button
          title={editingAccount ? "Guardar cambios" : "Agregar cuenta"}
          onPress={editingAccount ? handleEditAccount : handleAddAccount}
          icon={
            editingAccount ? (
              <Check color={theme.colors.white} />
            ) : (
              <PlusCircle color={theme.colors.white} />
            )
          }
          loading={
            editingAccount
              ? updateBankAccount.isPending
              : addBankAccount.isPending
          }
          size="large"
        />
      </Box>
    </Card>
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando..." />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Box flex={1} backgroundColor="background">
        {/* Header */}
        <Gradient
          colors={[
            theme.colors.linearGradientPrimary1,
            theme.colors.linearGradientPrimary2,
          ]}
        >
          <Box paddingHorizontal="l" paddingTop="xxxl" paddingBottom="m">
            <Box flexDirection="row" alignItems="center">
              <IconButton onPress={() => router.back()}>
                <ChevronLeft size={24} color="#FFFFFF" />
              </IconButton>
              <Box flex={1} marginLeft="m">
                <Text variant="title" style={{ color: theme.colors.white }}>
                  Números de cuentas
                </Text>
              </Box>
            </Box>
          </Box>
        </Gradient>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: theme.spacing.l }}
          showsVerticalScrollIndicator={false}
        >
          {!isAddingAccount && !editingAccount && (
            <Button
              title="Agregar nueva cuenta"
              onPress={() => setIsAddingAccount(true)}
              marginBottom="l"
              size="large"
              variant="primary2"
              icon={<PlusCircle color={theme.colors.white} />}
            />
          )}

          {(isAddingAccount || editingAccount) && renderForm()}

          {accounts.length === 0 ? (
            <Card padding="l" marginBottom="l">
              <Box alignItems="center" paddingVertical="xl">
                <Banknote size={48} color={theme.colors.textTertiary} />
                <Text
                  variant="subtitle"
                  color="text"
                  marginTop="m"
                  marginBottom="s"
                >
                  No hay cuentas registradas
                </Text>
                <Text variant="body" color="textSecondary" textAlign="center">
                  Agrega tu primera cuenta bancaria para comenzar
                </Text>
              </Box>
            </Card>
          ) : (
            <Box>
              <Text variant="subtitle" color="text" marginBottom="m">
                Mis cuentas ({accounts.length})
              </Text>
              {accounts.map(renderAccountCard)}
            </Box>
          )}
        </ScrollView>
      </Box>

      {/* Error Dialog */}
      <AlertDialog
        visible={showErrorDialog}
        title={dialogTitle}
        description={dialogMessage}
        icon={<X size={32} color={theme.colors.error} />}
        variant="error"
        onCancel={() => setShowErrorDialog(false)}
        confirmText="OK"
        cancelText=""
        onConfirm={() => setShowErrorDialog(false)}
        showCloseButton={false}
        stackedButtons={false}
      />

      {/* Success Dialog */}
      <AlertDialog
        visible={showSuccessDialog}
        title={dialogTitle}
        description={dialogMessage}
        icon={<Check size={32} color={theme.colors.success} />}
        variant="success"
        onCancel={() => setShowSuccessDialog(false)}
        confirmText="OK"
        cancelText=""
        onConfirm={() => setShowSuccessDialog(false)}
        showCloseButton={false}
        stackedButtons={false}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        visible={showDeleteDialog}
        title={dialogTitle}
        description={dialogMessage}
        variant="warning"
        onCancel={() => {
          setShowDeleteDialog(false);
          setAccountToDelete(null);
        }}
        onConfirm={confirmDeleteAccount}
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmButtonVariant="outlineError"
        cancelButtonVariant="outline"
        stackedButtons={false}
      />

      {/* Copy Success Dialog */}
      <AlertDialog
        visible={showCopyDialog}
        title={dialogTitle}
        description={dialogMessage}
        icon={<Check size={32} color={theme.colors.success} />}
        variant="success"
        onCancel={() => setShowCopyDialog(false)}
        confirmText="OK"
        cancelText=""
        onConfirm={() => setShowCopyDialog(false)}
        showCloseButton={false}
        stackedButtons={false}
      />
    </>
  );
}
