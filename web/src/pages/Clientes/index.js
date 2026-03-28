import { useEffect } from "react";
import { Button, Drawer } from "rsuite";
import 'rsuite/dist/rsuite.min.css';
import Table from "../../components/Table";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
    allClientes,
    updateCliente,
    filterClientes
} from "../../store/modules/cliente/actions";





const Clientes = () => {
  const dispatch = useDispatch();
  const { clientes, form, cliente, behavior, components } = useSelector(
    (state) => state.cliente
    );

  const setComponent = (component, state) => {
    dispatch(
      updateCliente({
        components: { ...components, [component]: state },
      }),
    );
  };

  const setCliente = (key, value) => {
    dispatch(
      updateCliente({
        cliente: { ...cliente, [key]: value },
      }),
    );
   }

   const save = ( ) => {
    console.log('save');
   };

  useEffect(() => {
    dispatch(allClientes());
  }, [dispatch]);

  return (
    <>
      {}
      <Drawer
        open={components.drawer}  
        size="sm"
        onClose={() => setComponent("drawer", false)}>
        <Drawer.Body>
            <h3>{behavior === 'create' ? 'Criar novo' : 'Atualizar'} cliente</h3>
            <div className="row mt-3"><div className="form-group col-12 mb-3">
                <b>E-mail</b>
                <div className="input-group">
                    <input type="email" 
                    className="form-control"
                    placeholder="E-mail do cliente" 
                    value={cliente.email}
                    onChange={(e) =>  setCliente('email', e.target.value)}
                    />
                    <div className="input-group-append">
                        <Button appearance="primary" 
                        loading={form.filtering} 
                        disabled ={form.filtering} 
                        onClick={()=>dispatch(filterClientes())}
                        >
                            Pesquisar
                        </Button>
                    </div>
                </div>
            </div>
            <div className="form-group col-6">
              <b className="">Nome</b>
              <input
                type="text"
                className="form-control"
                placeholder="Nome do Cliente"
                disabled={form.disabled}
                value={cliente.nome}
                onChange={(e) => setCliente('nome', e.target.value)}
              />
            </div>
            <div className="form-group col-6">
              <b className="">Telefone / Whatsapp</b>
              <input
                type="text"
                className="form-control"
                placeholder="Telefone / Whatsapp do Cliente"
                disabled={form.disabled}
                value={cliente.telefone}
                onChange={(e) => setCliente('telefone', e.target.value)}
              />
            </div>
            <div className="form-group col-6">
              <b className="">Data de Nascimento</b>
              <input
                type="date"
                className="form-control"
                disabled={form.disabled}
                value={cliente.dataNascimento}
                onChange={(e) => setCliente('dataNascimento', e.target.value)}
              />
            </div>
            <div className="form-group col-6">
              <b>Sexo</b>
              <select
                disabled={form.disabled}
                className="form-control"
                value={cliente.sexo}
                onChange={(e) => setCliente('sexo', e.target.value)}
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>
        </div>
        <Button
            block
            className="btn-lg mt-3"
            color ={ behavior === 'create' ? 'green' : 'red'}
            size = 'lg'
            loading = { form.saving }
            onClick={() => {
                if (behavior === 'create'){
                    save();
                } else {

                }
            }}
        >
            
            {behavior === 'create' ? 'Salvar' : 'Remover'} Cliente
        </Button>
        </Drawer.Body>
      </Drawer>

      {/* Seu código original permanece igual */}
      <div className="col p-5 overflow-auto h-100">
        <div className="row">
          <div className="col-12">
            <div className="w-100 d-flex justify-content-between">
              <h2 className="mb-4 mt-0">Clientes</h2>
              <div>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    dispatch(updateCliente({ 
                        behavior: "create" 
                    }));
                    setComponent("drawer", true);
                  }}
                >
                  <span className="mdi mdi-plus">Novo Cliente</span>
                </button>
              </div>
            </div>
            <Table
              loading={form.filtering}
              data={clientes}
              config={[
                { label: "Nome", key: "nome", width: 200, fixed: true },
                { label: "E-email", key: "email", width: 200 },
                { label: "Telefone", key: "telefone", width: 200 },
                {
                  label: "Sexo",
                  content: (cliente) =>
                    cliente.sexo === "M" ? "Masculino" : "Feminino",
                  width: 200,
                },
                {
                  label: "Data Cadastro",
                  content: (cliente) =>
                    moment(cliente.dataCadastro).format("DD/MM/YYYY"),
                  width: 200,
                },
              ]}
              actions={(cliente) => (
                <Button appearance="primary" size="xs">
                  Ver informaçôes
                </Button>
              )}
              onRowClick={(cliente) => {
                    dispatch(
                        updateCliente({ 
                        behavior: "update", 
                        })
                    );
                dispatch(
                    updateCliente({
                        cliente,
                    })
                );
                setComponent("drawer", true);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Clientes;