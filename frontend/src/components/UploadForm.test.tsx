import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UploadForm } from "./UploadForm";

afterEach(cleanup);

function renderForm() {
  return render(
    <UploadForm
      loading={false}
      onResult={vi.fn()}
      onError={vi.fn()}
      onLoadingChange={vi.fn()}
    />,
  );
}

describe("UploadForm", () => {
  it("valida currículo vazio e JSON inválido", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText("Vaga em JSON"), {
      target: { value: "{" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Analisar compatibilidade" }),
    );
    expect(
      await screen.findByText("Informe ou carregue o texto do currículo."),
    ).toBeInTheDocument();
    expect(screen.getByText("O JSON da vaga é inválido.")).toBeInTheDocument();
  });

  it("valida campos obrigatórios da vaga", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText("Texto do currículo"), {
      target: { value: "Python" },
    });
    fireEvent.change(screen.getByLabelText("Vaga em JSON"), {
      target: { value: JSON.stringify({ jobId: "", requiredSkills: [] }) },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Analisar compatibilidade" }),
    );
    await waitFor(() =>
      expect(
        screen.getByText("Informe um JSON com jobId e requiredSkills válidos."),
      ).toBeInTheDocument(),
    );
  });
});
