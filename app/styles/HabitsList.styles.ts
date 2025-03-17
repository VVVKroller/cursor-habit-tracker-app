import { StyleSheet } from "react-native";
import { colors } from "../utils/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface.light,
  },
  loadingText: {
    color: colors.text.primary,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface.light,
  },
  errorText: {
    color: colors.status.error,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 4,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
  },
  habitsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  habitsContainerContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    marginTop: -40,
  },
  emptyContent: {
    alignItems: "center",
    gap: 16,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface.medium,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.medium,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text.primary,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 280,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
  },
  gradient: {
    padding: 24,
    paddingTop: 16,
  },
  handle: {
    width: 32,
    height: 4,
    backgroundColor: colors.border.light,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.strong,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -4,
  },
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.secondary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: colors.surface.strong,
    borderRadius: 16,
    padding: 16,
    fontSize: 17,
    color: colors.text.primary,
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.text.secondary,
  },
});
