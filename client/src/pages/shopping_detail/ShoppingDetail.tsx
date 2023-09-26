import cs from "./ShoppingDetail.module.css"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { ShoppingItemsList } from './components/shopping_items_list/ShoppingItemsList'
import { ConfirmationModal } from '../../components/modals/confirmation/ConfirmationModal'
import { AddUsersModal } from './components/add_users_modal/AddUsersModal'
import { HorizontalUsersList } from "./components/horizontal_users_list/HorizontalUsersList"
import { ISessionService } from "../../services/sessionService"
import { IProductAssignmentsRepository, IPurchasesRepository, IShoppingsRepository, IUsersRepository } from "../../data/stbApi"
import { IShopping, IUser } from "../../data/models/domain"

export interface ShoppingDetailParams {
    id: number
}

export interface ShoppingDetailProps {
    sessionService: ISessionService
    shoppingsRepository: IShoppingsRepository
    usersRepository: IUsersRepository
    productAssignmentsRepository: IProductAssignmentsRepository
    purchasesRepository: IPurchasesRepository
}

export const ShoppingDetail = ({ sessionService, shoppingsRepository, usersRepository, productAssignmentsRepository, purchasesRepository }: ShoppingDetailProps) => {
    const navigate = useNavigate()
    const { id } = useParams() as unknown as ShoppingDetailParams

    const [shopping, setShopping] = useState<IShopping | null>(null)
    const [shoppingCreator, setShoppingCreator] = useState<IUser | null>(null)
    const [participants, setParticipants] = useState<IUser[]>([])

    const [userIsAuthor, setUserIsAuthor] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showAddUsersModal, setShowAddUsersModal] = useState(false)

    const [showRemoveUserModal, setShowRemoveUserModal] = useState(false)
    const [userToBeRemoved, setUserToBeRemoved] = useState<IUser | null>(null)


    useEffect(() => {
        fetchShoppingDetail()
        fetchParticipants()
    }, [id])

    useEffect(() => {
        if (shopping != null) {
            fetchShoppingCreator(shopping.creatorId)
        }
    }, [shopping])

    const fetchShoppingDetail = (): void => {
        shoppingsRepository.getShoppingById(id)
            .then((shp) => {
                setShopping(shp)
                setUserIsAuthor(sessionService.getUserId() == shp.creatorId)
            }).catch((err) => {
                // TODO
            })
    }

    const fetchParticipants = (): void => {
        usersRepository.getUsersOfShopping(id)
            .then((users) => {
                setParticipants(users)
            }).catch((err) => {
                // TODO
            })
    }

    const fetchShoppingCreator = (userId: number): void => {
        usersRepository.getUserById(userId)
            .then((creator) => {
                setShoppingCreator(creator)
            }).catch((err) => {
                // TODO
            })
    }


    const deleteShopping = (): void => {
        shoppingsRepository.deleteShopping(id)
            .then((success) => {
                if (success) {
                    navigate(-1)
                } else {
                    // TODO
                }
            }).catch((err) => {
                // TODO
            })
    }

    const assignUsersToShopping = async (users: IUser[]): Promise<void> => {
        const addedUsers = []
        for (let i = 0; i < users.length; i++) {
            const user = users[i]
            try {
                await usersRepository.assignUserToShopping(user.id, id)
                addedUsers.push(user)
            }
            catch (err) {
                console.log(err)
            }
        }
        setParticipants([...participants, ...addedUsers])
    }

    const unassignUserFromShopping = async (user: IUser): Promise<void> => {
        usersRepository.unassignUserFromShopping(user.id, id)
            .then((res) => {
                const newParticipants = [...participants]
                const index = newParticipants.indexOf(user)
                newParticipants.splice(index, 1)

                setParticipants(newParticipants)
                setUserToBeRemoved(null)
            }).catch((err) => {
                setUserToBeRemoved(null)
                // TODO
            })
    }



    return (
        <section className="shoppingDetailPageContent">
            <ConfirmationModal
                isShown={showDeleteModal}
                title={"Delete shopping"}
                body={"Are you sure you want to delete this shopping? This action is irreversible."}
                onDismiss={() => {
                    setShowDeleteModal(false)
                }}
                onConfirm={() => {
                    setShowDeleteModal(false)
                    deleteShopping()
                }} />


            <ConfirmationModal
                isShown={showRemoveUserModal}
                title={"Remove participant"}
                body={`Are you sure you want remove ${userToBeRemoved?.username || "user"} from this shopping? All the user's purchases will be removed.`}
                onDismiss={() => {
                    setUserToBeRemoved(null)
                    setShowRemoveUserModal(false)
                }}
                onConfirm={() => {
                    setShowRemoveUserModal(false)
                    if (userToBeRemoved) {
                        unassignUserFromShopping(userToBeRemoved)
                    }
                }} />

            <AddUsersModal
                isShown={showAddUsersModal}
                sessionService={sessionService}
                usersRepository={usersRepository}
                alreadyAssignedUsers={participants}
                onDismiss={() => { setShowAddUsersModal(false) }}
                onConfirm={(newUsers) => {
                    assignUsersToShopping(newUsers)
                    setShowAddUsersModal(false)
                }} />

            <div className={cs.shoppingDetailContainer}>
                <div className={cs.containerHeader}>
                    <div className={cs.titleAndAuthorContainer}>
                        <h1 className={cs.name}>{shopping?.name}</h1>

                        {shopping?.description && (
                            <p>{shopping.description}</p>
                        )}

                        {userIsAuthor && (
                            <button className={cs.deleteButton} onClick={(e) => {
                                setShowDeleteModal(true)
                            }}>
                                <FontAwesomeIcon icon={faTrash} />
                                Delete
                            </button>
                        )}

                        <span>{`By: ${shoppingCreator?.username} (${shoppingCreator?.email})`}</span>
                    </div>

                </div>

                <div className={cs.participants}>
                    <div className={cs.subHeader}>
                        <h2>Participants</h2>
                        <button className="circularButton" onClick={(e) => {
                            setShowAddUsersModal(true)
                        }}>
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                    <HorizontalUsersList
                        sessionService={sessionService}
                        users={participants}
                        onUserClicked={(user) => {
                            navigate(`/users/${user.id}`)
                        }}
                        onUserDelete={userIsAuthor ? (user) => {
                            setUserToBeRemoved(user)
                            setShowRemoveUserModal(true)
                        }
                            :
                            null
                        } />
                </div>

            </div>

            {shopping && (
                <div className={cs.shoppingDetailPageContent}>
                    <ShoppingItemsList sessionService={sessionService} productAssignmentsRepository={productAssignmentsRepository}
                        purchasesRepository={purchasesRepository} shopping={shopping} />
                </div>
            )}
        </section>
    )
}