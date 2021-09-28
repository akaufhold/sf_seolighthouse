<?php

namespace Stackfactory\SfSeolighthouse\Domain\Repository;
use TYPO3\CMS\Belog\Domain\Repository\LogEntryRepository;

class LogEntryLighthouseRepository extends LogEntryRepository {    
    /**
     * Find next item by uid
     * @param integer $uid The uid of the current record
     * @return boolean|\TYPO3\CMS\Extbase\Persistence\Generic\QueryResult 
     */
    
    public function findNext($uid) {
        $query = $this->createQuery();
        $result = $query->matching($query->greaterThan('uid',$uid))->setLimit(1)->execute();
        if($query->count()) {
            return $result;
        } else {
            return false;
        }
    }
    
    /**
     * Find previous item by uid
     * @param integer $uid The uid of the current record
     * @return boolean|\TYPO3\CMS\Extbase\Persistence\Generic\QueryResult 
     */
    public function findPrev($uid) {
        $query = $this->createQuery();
        $ordering = array('uid'=>\TYPO3\CMS\Extbase\Persistence\QueryInterface::ORDER_DESCENDING);
        $result = $query->matching($query->lessThan('uid',$uid))->setLimit(1)->setOrderings($ordering)->execute();
        if($query->count()) {
            return $result;
        } else {
            return false;
        }
    }
}

?>