"use client";

import {
  createTestAction,
  updateTestMetaAction,
} from "@/src/server/actions/admin-tests";
import { TestMetaFormView } from "./test-meta-form-view";
import { useTestMetaForm } from "./use-test-meta-form";
import type { TestMetaInitial } from "./types";

interface TestMetaFormContainerProps {
  mode: "create" | "edit";
  testId?: string;
  initial?: TestMetaInitial;
}

/** 메타 폼 Container: 모드에 따라 생성/수정 액션을 골라 ViewModel→View 연결. */
export function TestMetaFormContainer({
  mode,
  testId,
  initial,
}: TestMetaFormContainerProps) {
  const action = mode === "create" ? createTestAction : updateTestMetaAction;
  const { formAction, pending, error, ok, coverPreview, onPickCover } =
    useTestMetaForm(action);

  return (
    <TestMetaFormView
      mode={mode}
      testId={testId}
      initial={initial}
      formAction={formAction}
      pending={pending}
      error={error}
      ok={ok}
      coverPreview={coverPreview}
      onPickCover={onPickCover}
    />
  );
}
