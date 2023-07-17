import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Container, Form, Table } from 'react-bootstrap'
import ReactDatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import ReactPaginate from 'react-paginate';

const Home = () => {

    const[transferencias, setTransferencias] = useState([])
    const[search, setSearch] = useState('')
    const[currentPage, setCurrentPage] = useState(0);

    const min = new Date(new Date(2018, 12, 1))
    const[minDate, setMinDate] = useState(min)
    const[maxDate, setMaxDate] = useState(new Date())
    const[saldoTotal, setSaldoTotal] = useState(0)
    
    const handlePageClick = data => {
      const selectedPage = data.selected;
      setCurrentPage(selectedPage);
    };

    const saldoPeriodo = transferencias.reduce((total, current) => total + current.valor, 0)
    if (saldoPeriodo > saldoTotal) {
        setSaldoTotal(saldoPeriodo)
    }

    useEffect(() => {
        if (minDate && maxDate) {
            const dmin = minDate.toISOString().slice(0, 10)
            const dmax = maxDate.toISOString().slice(0, 10)

            axios
                .get(`http://localhost:8080/servicos/transferencias?minDate=${dmin}&maxDate=${dmax}&page=${currentPage}`)
                .then(response => {
                   setTransferencias(response.data);
                 })
                .catch(error => {
                 console.error('Erro ao buscar transferências:', error);
         });
        }
    }, [minDate, maxDate]);

  return (
    <div className="border-4 solid #ECECEC">
        <Container>
            <h1 className="text-center mt-4">Extrato bancário</h1>
            <Form>
                <h2 className="text-center mt-4">Transações</h2>
                <div className="d-flex gap-3">
                    <div className="mb-4">
                        <p>Data Inicial</p>
                        <ReactDatePicker
                            selected={minDate}
                            onChange={(date) => setMinDate(date)}
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                    <div className="mb-4">
                        <p>Data Final</p>
                        <ReactDatePicker
                            selected={maxDate}
                            onChange={(date) => setMaxDate(date)}
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                </div>
                
                <div className="d-flex gap-3">
                    <Form.Control
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Digite o nome do operador da transação"
                    />
                </div>
            </Form>
            <div className="mt-4">

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Data da Transação</th>
                            <th>Valor da Transação</th>
                            <th>Tipo de Serviço</th>
                            <th>Nome Operador da Transação</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        transferencias.filter((transf) => {
                            if (search && search.toLowerCase() !== '') {
                                return transf.nomeOperadorTransacao && transf.nomeOperadorTransacao.toLowerCase().includes(search.toLowerCase());
                            } else {
                                return true;
                            }
                        }).map((transf) =>
                            <tr key={transf.id}>
                                <td>{new Date(transf.dataTransferencia).toLocaleDateString('pt-BR')}</td>
                                <td>R$ {transf.valor}</td>
                                <td>{transf.tipo}</td>
                                <td>{transf.nomeOperadorTransacao || 'Transação sem operador!'}</td>
                            </tr>
                        )
                    }
                    </tbody>
                    <ReactPaginate
                        previousLabel={'< Anterior'}
                        nextLabel={'Próxima >'}
                        breakLabel={'...'}
                        pageCount={2}
                        marginPagesDisplayed={4}
                        pageRangeDisplayed={1}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'}
                    />
                </Table>
            
            </div>
        </Container>
    </div>
  )
}

export default Home