"use client";

import {
  createSetAction,
  updateSetMetaAction,
} from "@/src/server/actions/admin-sets";
import { SetMetaFormView } from "./set-meta-form-view";
import { useSetMetaForm } from "./use-set-meta-form";
import type { SetMetaInitial } from "./types";

interface SetMetaFormContainerProps {
  mode: "create" | "edit";
  setId?: string;
  initial?: SetMetaInitial;
}

/** 세트 메타 폼 Container: 모드에 따라 생성/수정 액션 선택. */
export function SetMetaFormContainer({
  mode,
  setId,
  initial,
}: SetMetaFormContainerProps) {
  const action = mode === "create" ? createSetAction : updateSetMetaAction;
  const { formAction, pending, error, ok } = useSetMetaForm(action);

  return (
    <SetMetaFormView
      mode={mode}
      setId={setId}
      initial={initial}
      formAction={formAction}
      pending={pending}
      error={error}
      ok={ok}
    />
  );
}
