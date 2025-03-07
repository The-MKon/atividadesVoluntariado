const DataBase = require("../database/index");
const db = new DataBase("atividades");

exports.listarAtividades = (req, res) => {
    db.readAllData((err, atividades) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar as atividades" });
        }

        const atividadesDisponiveis = atividades
            .map(a => JSON.parse(a.value))
            .filter(a => a.inscritos.length < a.vagas);

        res.json(atividadesDisponiveis);
    })
}

exports.criarAtividade = (req, res) => {
    const {nome, descricao, data, local, vagas} = req.body;

    if (!nome || !descricao || !data || !local || !vagas) {
        return res.status(400).json({ error: "O preenchimento de todos campos é obrigatório" });
    }

    const id = Date.now().toString();
    const atividade = {id, nome, descricao, data, local, vagas, inscritos: []};

    db.put(id, JSON.stringify(atividade), (err) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao salvar a atividade" });
        }
        res.status(201).json(atividade);
    })
}

exports.editarAtividade = (req, res) => {
    const {id} = req.params;
    const {nome, descricao, data, local, vagas} = req.body;

    if (!nome || !descricao || !data || !local || !vagas) {
        return res.status(400).json({ error: "O preenchimento de todos campos é obrigatório" });
    }

    db.get(id, (err, value) => {
        if (err || !value) {
            return res.status(404).json({ error: "Atividade não encontrada" });
        }

        const atividade = JSON.parse(value);

        atividade.nome = nome;
        atividade.descricao = descricao;
        atividade.data = data;
        atividade.local = local;
        atividade.vagas = vagas;

        db.put(id, JSON.stringify(atividade), (err) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao editar a atividade" });
            }
            res.json({message: "Atividade atualizada com sucesso", atividade});
        })
    })
}

exports.excluirAtividade = (req, res) => {
    const {id} = req.params;

    db.get(id, (err, value) => {
        if (err || !value) {
            return res.status(404).json({ error: "Atividade não encontrada" });
        }

        db.delete(id, (err) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao excluir a atividade" });
            }

            res.json({ message: "Atividade excluída com sucesso" })
        })
    })
}

exports.listarParticipantes = (req, res) => {
    const {id} = req.params;

    db.get(id, (err, value) => {
        if (err || !value) {
            return res.status(404).json({ error: "Atividade não encontrada" });
        }

        const atividade = JSON.parse(value);

        res.json({inscritos: atividade.inscritos});
    })
}

exports.inscreverUsuario = (req, res) => {
    const {id} = req.params;
    const email = req.user.email;

    db.get(id, (err, value) => {
        if (err || !value) {
            return res.status(404).json({ error: "Atividade não encontrada" });
        }

        const atividade = JSON.parse(value);

        if (atividade.inscritos.includes(email)) {
            return res.status(400).json({ error: "O usuário já está inscrito nesta atividade" });
        }

        if (atividade.inscritos.length >= atividade.vagas) {
            return res.status(400).json({ error: "Número máximo de inscrições atingido" });
        }

        atividade.inscritos.push(email);

        db.put(id, JSON.stringify(atividade), (err) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao inscrever o usuário" });
            }

            res.json({ message: "Usuário inscrito com sucesso", atividade });
        })
    })
}

exports.cancelarInscricao = (req, res) => {
    const {id} = req.params;
    const email = req.user.email;

    db.get(id, (err, value) => {
        if (err || !value) {
            return res.status(404).json({ error: "Atividade não encontrada" });
        }

        const atividade = JSON.parse(value);
    
        if (!atividade.inscritos.includes(email)) {
            return res.status(400).json({ error: "O usuário não está inscrito nesta atividade" });
        };
    
        atividade.inscritos = atividade.inscritos.filter(inscrito => inscrito !== email);
    
        db.put(id, JSON.stringify(atividade), (err) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao cancelar a inscrição" });
            }
            res.json({ message: "Inscrição cancelada com sucesso", atividade });
        })

    });

}

exports.listarAtividadesInscrito = (req, res) => {
    const email = req.user.email;

    db.readAllData((err, atividades) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar as atividades" });
        }

        const atividadesInscritas = atividades
           .map(a => JSON.parse(a.value))
           .filter(a => a.inscritos.includes(email));

           res.json(atividadesInscritas);
    })
}